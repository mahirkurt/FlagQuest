import { countries, Country } from '../data/countries';

export interface EncyclopediaSnippet {
  code: string;
  name: string;
  capital: string;
  region: string;
  fact: string;
  didYouKnow: string;
}

export const encyclopediaService = {
  /**
   * Retrieve a 'Did You Know?' snippet for a given country code
   */
  getSnippetByCountryCode: (code: string): EncyclopediaSnippet | null => {
    if (!code) return null;
    const country = countries.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!country) return null;
    return {
      code: country.code,
      name: country.name,
      capital: country.capital,
      region: country.region,
      fact: country.funFact,
      didYouKnow: country.funFact
    };
  },

  /**
   * Get the fact string directly for a country
   */
  getDidYouKnow: (code: string): string => {
    const country = countries.find(c => c.code.toLowerCase() === code.toLowerCase());
    return country?.funFact || 'Birleşmiş Milletler üyesi bağımsız bir devlettir.';
  },

  /**
   * Returns all countries in the encyclopedia
   */
  getAllCountries: (): Country[] => {
    return countries;
  },

  /**
   * Search encyclopedia entries by query
   */
  search: (query: string): Country[] => {
    const cleanQuery = query.trim().toLowerCase();
    if (!cleanQuery) return countries;
    return countries.filter(c => 
      c.name.toLowerCase().includes(cleanQuery) || 
      c.capital.toLowerCase().includes(cleanQuery) ||
      c.region.toLowerCase().includes(cleanQuery)
    );
  }
};
