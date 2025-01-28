const request = require('supertest');
const app = require('../index');
const awsServiceModule = require('../src/awsService');

jest.mock('../src/awsService', () => {
    return {
        ...jest.requireActual('../src/awsService'),
        getMetricDataFromCloudWatch: jest.fn(),
        getInstanceIdForIPAddress: jest.fn()
    };
});

let getMetricDataFromCloudWatchSpy, getInstanceIdForIPAddressSpy;

const metricDataSuccessResponse = {
    Timestamps: [new Date().toISOString()],
    Values: [0.8355551017524439]
};

beforeEach(() => {
    getMetricDataFromCloudWatchSpy = jest
        .spyOn(awsServiceModule, 'getMetricDataFromCloudWatch')
        .mockResolvedValue(metricDataSuccessResponse);

    getInstanceIdForIPAddressSpy = jest
        .spyOn(awsServiceModule, 'getInstanceIdForIPAddress')
        .mockResolvedValue('i-1234567890abcdef0');
});

afterEach(() => {
    getMetricDataFromCloudWatchSpy.mockRestore();
    getInstanceIdForIPAddressSpy.mockRestore();
});

describe("Test the API", () => {
    test("Failed, invalid route", done => {
      request(app)
        .get("/")
        .then(response => {
            expect(response.statusCode).toBe(404);
            expect(response.text).toEqual(
                expect.stringContaining('Routing does not exist. GET')
            );
            done();
        });
    });

    test("Failed, missing request query", done => {
        request(app)
            .get("/cpu-usage")
            .then(response => {
                expect(response.statusCode).toBe(400);
                expect(response.text).toEqual(
                    expect.stringContaining('ipAddress', 'is required')
                );
                done();
          });
    });

    test("Success to get cpu usage", done => {
        request(app)
            .get("/cpu-usage?ipAddress=192.100.88.16&periodDays=2&period=3600")
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(getMetricDataFromCloudWatchSpy).toHaveBeenCalledTimes(1);
                expect(getInstanceIdForIPAddressSpy).toHaveBeenCalledTimes(1);
                expect(response.body).toEqual(metricDataSuccessResponse);
                done();
            });
    });

    test("Failed to get instance id", done => {
        getInstanceIdForIPAddressSpy.mockRejectedValue(new Error('Failed to get instance id'));

        request(app)
          .get("/cpu-usage?ipAddress=192.100.88.16&periodDays=2&period=3600")
          .then(response => {
                expect(response.statusCode).toBe(500);
                done();
            });
    });
});

