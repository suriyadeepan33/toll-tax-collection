const License = require('../models/license');

const licenseController = {
    enterCar: async (req, res) => {
        try {
            // console.log(req.body);
            let { numberPlate, entryLocation } = req.body;

            if (!numberPlate || !entryLocation) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'kindly fill empty blanks',
                })
            }

            const carCheck = await License.find({ numberPlate: req.body.numberPlate });

            if (carCheck.length) {
                const carExitLocation = carCheck.filter(element => element.exitLocation === '');

                if (carExitLocation.length) {
                    return res.status(409).json({
                        status: 'failed',
                        message: 'Car with this number plate is already entered at this toll plaza',
                    })
                }
            }

            req.body.exitLocation = '';
            req.body.toll = 20;
            const car = new License(req.body);

            const savedData = await car.save();
            res.status(201).json({
                status: 'successful',
                savedData
            })
        } catch (error) {
            console.log(error.message)
        }
    },
    exitCar: async (req, res) => {
        try {
            const car = await License.find({ numberPlate: req.params.noPlate });
            console.log("no. of car entries " + car.length)
            if (!car.length) {
                return res.status(404).json({
                    stauts: 'failed',
                    message: `No entrance recod found against ${req.params.noPlate}`
                })
            }


            const carFilter = car.filter(element => !element.exitLocation)[0];
            console.log("exit location " + carFilter);
            if (carFilter.length === 0) {
                return res.status(409).json({
                    status: 'failed',
                    message: 'Car with this number plate already exited',
                });
            }

            const { exitLocation } = req.body;
            console.log(exitLocation)
            if (!exitLocation) {
                return res.status(404).json({
                    status: 'failed',
                    message: 'kindly fill all empty fileds',
                });
            };

            // const startPoint = carFilter.find(ele => ele.entryLocation);
            const entryLocation = carFilter.entryLocation;
            console.log(entryLocation);

            // tax and toll calculations
            const distanceRate = 0.2;
            const cityDistance = { peshawar: 0, islamabad: 200, lahore: 600, karachi: 2000 };
            let distanceCalculation = cityDistance[entryLocation] - cityDistance[exitLocation];
            let distance = Math.abs(distanceCalculation);
            console.log(distance);
            let toll = 20 + (distanceRate * distance);

            console.log(toll)
            // special day discount and 
            let date = new Date();
            let dayOfWeek = date.getDay();
            const monthName = ['january', 'feburary', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'octbor', 'november', 'december'];
            let monthOfYear = date.getMonth();
            let today = date.getDate();
            let month = monthName[monthOfYear];
            let monthDate = today + month;

            console.log(monthDate);
            // weekend double charges
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                toll *= 1.5;
            }

            // special day discount
            const isDiscountDay = {'14august':14, '6september':6, '23march':23};
            let discount = 0;
            if (isDiscountDay[monthDate]) {
                switch (monthDate) {
                    case '23march':
                        discount = 23;
                        break;
                    case '14august':
                        discount = 14;
                        break;
                    case '6september':
                        discount = 6;
                        break;
                    default:
                        break;
                }
            }
            console.log(isDiscountDay[monthDate]);
            if (discount > 0) {
                toll = toll * (100 - discount) / 100;
            }
            console.log(toll);
            carFilter.exitLocation = exitLocation;
            carFilter.toll = toll;
            await carFilter.save();

            res.status(200).json({
                status: 'success',
                carFilter,
            })
        } catch (error) {
            console.log(error.message)
        }
    },
    getCar: async (req, res) => {
        try {
            const car = await License.find({ numberPlate: req.params.noPlate });
            res.status(200).json({
                status: 'success',
                car,
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({
                status: 'failed',
                message: 'internal server error',
            })
        }
    },
}

module.exports = licenseController;