import data from '../data/cities.json';

export const germanCitiesMeta = {
  generatedAt: data.generatedAt,
  source: data.source,
  minPopulation: data.minPopulation,
};

export function getGermanCities({ minPopulation = data.minPopulation } = {}) {
  return data.cities.filter((c) => c.population >= minPopulation);
}
