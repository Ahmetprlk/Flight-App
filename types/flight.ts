export interface Airport {
  iataCode: string;
  at: string;
}

export interface Segment {
  departure: Airport;
  arrival: Airport;
  carrierCode: string;
  number: string;
  duration: string;
  numberOfStops: number;
  aircraft?: {
    code: string;
  };
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface Fee {
  amount: string;
  type: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees: Fee[];
  grandTotal: string;
}

export interface FareDetailsBySegment {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  brandedFare?: string;
  class: string;
  includedCheckedBags?: {
    quantity: number;
  };
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: Price;
  fareDetailsBySegment: FareDetailsBySegment[];
}

export interface FlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface FlightSearchResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: FlightOffer[];
}

export interface SearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate?: string;
  returnDate?: string;
  adults: number;
  max?: number;
}

export interface FilterOptions {
  sortBy: 'price' | 'duration' | 'departure';
  tripType: 'all' | 'oneWay' | 'roundTrip';
  refundableOnly: boolean;
  checkedBagsOnly: boolean;
}