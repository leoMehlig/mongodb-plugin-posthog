var groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
};

async function processEventBatch(batch, { config, global }) {
    const rows = batch.map((oneEvent) => {
        const { event, properties, $set, $set_once, distinct_id, team_id, site_url, now, sent_at, uuid, ..._discard } = oneEvent
        const ip = properties?.['$ip'] || oneEvent.ip
        const timestamp = oneEvent?.timestamp || oneEvent?.data?.timestamp || properties?.timestamp || now || sent_at
        let ingestedProperties = properties
        let elements = []

        // only move prop to elements for the $autocapture action
        if (event === '$autocapture' && properties['$elements']) {
            const { $elements, ...props } = properties
            ingestedProperties = props
            elements = $elements
        }

        return {
            uuid,
            event,
            properties: JSON.stringify(ingestedProperties || {}),
            elements: JSON.stringify(elements || {}),
            set: JSON.stringify($set || {}),
            set_once: JSON.stringify($set_once || {}),
            distinct_id,
            team_id,
            ip,
            site_url,
            timestamp: timestamp,
        }
    })


    var events = groupBy(rows, "event")

    const response = await fetchWithRetry(
        config.url,
        {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(events),
        },
        'POST'
    )

    if (!statusOk(response)) {
        console.log(`Unable to send events to mongodb`)
    }
    return batch
}


async function fetchWithRetry(url, options = {}, method = 'GET', isRetry = false) {
    try {
        const res = await fetch(url, { method: method, ...options })
        return res
    } catch {
        if (isRetry) {
            throw new Error(`${method} request to ${url} failed.`)
        }
        const res = await fetchWithRetry(url, options, (method = method), (isRetry = true))
        return res
    }
}

function statusOk(res) {
    return String(res.status)[0] === '2'
}