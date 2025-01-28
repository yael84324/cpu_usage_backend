const { getMetricDataFromCloudWatch, getInstanceIdFromIP } = require('./awsService');

async function getCpuUsage(req) {
    const { ipAddress, periodDays, period } = req.query;
    
    const instanceId = await getInstanceIdFromIP(ipAddress);

    const currentTime = new Date();

    const startTime = currentTime.setDate(currentTime.getDate() + periodDays);

    const data = await getMetricDataFromCloudWatch(
        instanceId,
        startTime,
        currentTime,
        period
    );

    return {
      Timestamps: data.Timestamps,
      Values: data.Values,
    };
}

module.exports = { getCpuUsage };