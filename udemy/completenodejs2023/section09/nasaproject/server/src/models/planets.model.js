const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const habitablePlanets = [];

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' && 
        planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {

    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(global.appRoot, '..', 'data', 'kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitablePlanet(data)) {
                    habitablePlanets.push(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                console.log(habitablePlanets);
                console.log('CSV data loading done!');
                console.log(`Found ${habitablePlanets.length} habitable planets`);
                console.log(habitablePlanets.map((planet) => {
                    return planet['kepler_name']
                }));
                resolve();
            });
            
        }
    );
}

module.exports = {
    planets: habitablePlanets,
    loadPlanetsData: loadPlanetsData,
}
