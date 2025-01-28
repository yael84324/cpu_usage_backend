
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getCpuUsage } = require('./src/getCpuUsage');
const { validateRequestQuery } = require('./src/validateRequest');

const app = express(); 

app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 3000;

async function main() {
	app.get('/cpu-usage', async (req, res) => {
		let ret = { status: 200, data: { success: true } };
		
		const validateRes = validateRequestQuery(req);
		if (!validateRes.success) {
			res.status(400).send(validateRes);
			return;
		}

		try {
			const metricData = await getCpuUsage(req);
			
			res.status(200).send(metricData);
		} catch (error) {
			res.status(500).json({
				message: "Error while processing request",
				error: error,
			});
		}
	});

	app.get('*', async (req, res) => {
		res.status(404).send({ status: 404, success: false, error: `Routing does not exist. ${req.method} => ${req.path}` });
	});

	app.listen(PORT, async () => {
		console.log(`Server running on port ${PORT}`);
	});
}

main();