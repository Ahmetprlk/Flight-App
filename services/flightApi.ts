import axios from 'axios';
import { SearchParams, FlightSearchResponse, FlightOffer } from '@/types/flight';

// Amadeus API credentials (güvenli şekilde .env dosyasından alınmalı)
const AMADEUS_CLIENT_ID = process.env.AMADEUS_CLIENT_ID;
const AMADEUS_CLIENT_SECRET = process.env.AMADEUS_CLIENT_SECRET;
const AMADEUS_API_URL = 'https://test.api.amadeus.com';

// Token alma fonksiyonu
async function getAccessToken() {
  const response = await axios.post(`${AMADEUS_API_URL}/v1/security/oauth2/token`, null, {
    params: {
      grant_type: 'client_credentials',
      client_id: AMADEUS_CLIENT_ID,
      client_secret: AMADEUS_CLIENT_SECRET,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data.access_token;
}

// Uçuş arama fonksiyonu
export async function searchFlight(params: SearchParams): Promise<FlightSearchResponse> {
  const accessToken = await getAccessToken();
  const response = await axios.get(`${AMADEUS_API_URL}/v2/shopping/flight-offers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      originLocationCode: params.originLocationCode,
      destinationLocationCode: params.destinationLocationCode,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      adults: params.adults,
      max: params.max || 10,
    },
  });
  return response.data;
}


// const MOCK_FLIGHT_DATA: FlightOffer[] = [
//   {
//     type: 'flight-offer',
//     id: '4',
//     source: 'GDS',
//     instantTicketingRequired: false,
//     nonHomogeneous: false,
//     oneWay: false,
//     lastTicketingDate: '2024-02-15',
//     numberOfBookableSeats: 4,
//     itineraries: [
//       {
//         duration: 'PT3H45M',
//         segments: [
//           {
//             departure: {
//               iataCode: 'IST',
//               at: '2024-02-20T07:30:00'
//             },
//             arrival: {
//               iataCode: 'LHR',
//               at: '2024-02-20T09:15:00'
//             },
//             carrierCode: 'BA',
//             number: '678',
//             duration: 'PT3H45M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '320'
//             }
//           }
//         ]
//       }
//     ],
//     price: {
//       currency: 'USD',
//       total: '450.75',
//       base: '380.00',
//       fees: [
//         {
//           amount: '70.75',
//           type: 'SUPPLIER'
//         }
//       ],
//       grandTotal: '450.75'
//     },
//     pricingOptions: {
//       fareType: ['PUBLISHED'],
//       includedCheckedBagsOnly: true
//     },
//     validatingAirlineCodes: ['BA'],
//     travelerPricings: [
//       {
//         travelerId: '1',
//         fareOption: 'STANDARD',
//         travelerType: 'ADULT',
//         price: {
//           currency: 'USD',
//           total: '450.75',
//           base: '380.00',
//           fees: [
//             {
//               amount: '70.75',
//               type: 'SUPPLIER'
//             }
//           ],
//           grandTotal: '450.75'
//         },
//         fareDetailsBySegment: [
//           {
//             segmentId: '1',
//             cabin: 'ECONOMY',
//             fareBasis: 'KPROMO',
//             class: 'K',
//             includedCheckedBags: {
//               quantity: 1
//             }
//           }
//         ]
//       }
//     ]
//   },
//   {
//     type: 'flight-offer',
//     id: '5',
//     source: 'GDS',
//     instantTicketingRequired: false,
//     nonHomogeneous: false,
//     oneWay: false,
//     lastTicketingDate: '2024-02-15',
//     numberOfBookableSeats: 6,
//     itineraries: [
//       {
//         duration: 'PT6H30M',
//         segments: [
//           {
//             departure: {
//               iataCode: 'IST',
//               at: '2024-02-20T23:55:00'
//             },
//             arrival: {
//               iataCode: 'DXB',
//               at: '2024-02-21T05:25:00'
//             },
//             carrierCode: 'EK',
//             number: '122',
//             duration: 'PT6H30M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '77W'
//             }
//           }
//         ]
//       }
//     ],
//     price: {
//       currency: 'USD',
//       total: '685.30',
//       base: '590.00',
//       fees: [
//         {
//           amount: '95.30',
//           type: 'SUPPLIER'
//         }
//       ],
//       grandTotal: '685.30'
//     },
//     pricingOptions: {
//       fareType: ['PUBLISHED'],
//       includedCheckedBagsOnly: true
//     },
//     validatingAirlineCodes: ['EK'],
//     travelerPricings: [
//       {
//         travelerId: '1',
//         fareOption: 'STANDARD',
//         travelerType: 'ADULT',
//         price: {
//           currency: 'USD',
//           total: '685.30',
//           base: '590.00',
//           fees: [
//             {
//               amount: '95.30',
//               type: 'SUPPLIER'
//             }
//           ],
//           grandTotal: '685.30'
//         },
//         fareDetailsBySegment: [
//           {
//             segmentId: '1',
//             cabin: 'ECONOMY',
//             fareBasis: 'QPROMO',
//             class: 'Q',
//             includedCheckedBags: {
//               quantity: 2
//             }
//           }
//         ]
//       }
//     ]
//   },
//   {
//     type: 'flight-offer',
//     id: '6',
//     source: 'GDS',
//     instantTicketingRequired: false,
//     nonHomogeneous: false,
//     oneWay: false,
//     lastTicketingDate: '2024-02-15',
//     numberOfBookableSeats: 3,
//     itineraries: [
//       {
//         duration: 'PT7H15M',
//         segments: [
//           {
//             departure: {
//               iataCode: 'DXB',
//               at: '2024-02-20T09:30:00'
//             },
//             arrival: {
//               iataCode: 'CDG',
//               at: '2024-02-20T14:45:00'
//             },
//             carrierCode: 'EK',
//             number: '073',
//             duration: 'PT7H15M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '388'
//             }
//           }
//         ]
//       }
//     ],
//     price: {
//       currency: 'USD',
//       total: '890.60',
//       base: '780.00',
//       fees: [
//         {
//           amount: '110.60',
//           type: 'SUPPLIER'
//         }
//       ],
//       grandTotal: '890.60'
//     },
//     pricingOptions: {
//       fareType: ['PUBLISHED'],
//       includedCheckedBagsOnly: true
//     },
//     validatingAirlineCodes: ['EK'],
//     travelerPricings: [
//       {
//         travelerId: '1',
//         fareOption: 'STANDARD',
//         travelerType: 'ADULT',
//         price: {
//           currency: 'USD',
//           total: '890.60',
//           base: '780.00',
//           fees: [
//             {
//               amount: '110.60',
//               type: 'SUPPLIER'
//             }
//           ],
//           grandTotal: '890.60'
//         },
//         fareDetailsBySegment: [
//           {
//             segmentId: '1',
//             cabin: 'ECONOMY',
//             fareBasis: 'MPROMO',
//             class: 'M',
//             includedCheckedBags: {
//               quantity: 2
//             }
//           }
//         ]
//       }
//     ]
//   },
//   {
//     type: 'flight-offer',
//     id: '1',
//     source: 'GDS',
//     instantTicketingRequired: false,
//     nonHomogeneous: false,
//     oneWay: false,
//     lastTicketingDate: '2024-02-15',
//     numberOfBookableSeats: 3,
//     itineraries: [
//       {
//         duration: 'PT13H35M',
//         segments: [
//           {
//             departure: {
//               iataCode: 'IST',
//               at: '2024-02-20T10:30:00'
//             },
//             arrival: {
//               iataCode: 'JFK',
//               at: '2024-02-20T18:05:00'
//             },
//             carrierCode: 'TK',
//             number: '1',
//             duration: 'PT13H35M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '77W'
//             }
//           }
//         ]
//       },
//       {
//         duration: 'PT12H25M',
//         segments: [
//           {
//             departure: {
//               iataCode: 'JFK',
//               at: '2024-02-27T21:15:00'
//             },
//             arrival: {
//               iataCode: 'IST',
//               at: '2024-02-28T17:40:00'
//             },
//             carrierCode: 'TK',
//             number: '2',
//             duration: 'PT12H25M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '77W'
//             }
//           }
//         ]
//       }
//     ],
//     price: {
//       currency: 'USD',
//       total: '1245.80',
//       base: '1089.00',
//       fees: [
//         {
//           amount: '156.80',
//           type: 'SUPPLIER'
//         }
//       ],
//       grandTotal: '1245.80'
//     },
//     pricingOptions: {
//       fareType: ['PUBLISHED'],
//       includedCheckedBagsOnly: true
//     },
//     validatingAirlineCodes: ['TK'],
//     travelerPricings: [
//       {
//         travelerId: '1',
//         fareOption: 'STANDARD',
//         travelerType: 'ADULT',
//         price: {
//           currency: 'USD',
//           total: '1245.80',
//           base: '1089.00',
//           fees: [
//             {
//               amount: '156.80',
//               type: 'SUPPLIER'
//             }
//           ],
//           grandTotal: '1245.80'
//         },
//         fareDetailsBySegment: [
//           {
//             segmentId: '1',
//             cabin: 'ECONOMY',
//             fareBasis: 'TPROMO',
//             class: 'T',
//             includedCheckedBags: {
//               quantity: 1
//             }
//           }
//         ]
//       }
//     ]
//   },
//   {
//     type: 'flight-offer',
//     id: '2',
//     source: 'GDS',
//     instantTicketingRequired: false,
//     nonHomogeneous: false,
//     oneWay: false,
//     lastTicketingDate: '2024-02-15',
//     numberOfBookableSeats: 5,
//     itineraries: [
//       {
//         duration: 'PT15H20M',
//         segments: [
//           {
//             departure: {
//               iataCode: 'IST',
//               at: '2024-02-20T14:45:00'
//             },
//             arrival: {
//               iataCode: 'CDG',
//               at: '2024-02-20T18:15:00'
//             },
//             carrierCode: 'AF',
//             number: '1380',
//             duration: 'PT4H30M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '320'
//             }
//           },
//           {
//             departure: {
//               iataCode: 'CDG',
//               at: '2024-02-20T20:30:00'
//             },
//             arrival: {
//               iataCode: 'JFK',
//               at: '2024-02-21T06:05:00'
//             },
//             carrierCode: 'AF',
//             number: '007',
//             duration: 'PT8H35M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '77W'
//             }
//           }
//         ]
//       },
//       {
//         duration: 'PT14H10M',
//         segments: [
//           {
//             departure: {
//               iataCode: 'JFK',
//               at: '2024-02-27T22:30:00'
//             },
//             arrival: {
//               iataCode: 'CDG',
//               at: '2024-02-28T11:25:00'
//             },
//             carrierCode: 'AF',
//             number: '006',
//             duration: 'PT7H55M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '77W'
//             }
//           },
//           {
//             departure: {
//               iataCode: 'CDG',
//               at: '2024-02-28T13:40:00'
//             },
//             arrival: {
//               iataCode: 'IST',
//               at: '2024-02-28T18:40:00'
//             },
//             carrierCode: 'AF',
//             number: '1381',
//             duration: 'PT4H00M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '320'
//             }
//           }
//         ]
//       }
//     ],
//     price: {
//       currency: 'USD',
//       total: '987.50',
//       base: '856.00',
//       fees: [
//         {
//           amount: '131.50',
//           type: 'SUPPLIER'
//         }
//       ],
//       grandTotal: '987.50'
//     },
//     pricingOptions: {
//       fareType: ['PUBLISHED'],
//       includedCheckedBagsOnly: false
//     },
//     validatingAirlineCodes: ['AF'],
//     travelerPricings: [
//       {
//         travelerId: '1',
//         fareOption: 'STANDARD',
//         travelerType: 'ADULT',
//         price: {
//           currency: 'USD',
//           total: '987.50',
//           base: '856.00',
//           fees: [
//             {
//               amount: '131.50',
//               type: 'SUPPLIER'
//             }
//           ],
//           grandTotal: '987.50'
//         },
//         fareDetailsBySegment: [
//           {
//             segmentId: '1',
//             cabin: 'ECONOMY',
//             fareBasis: 'TPROMO',
//             class: 'T'
//           },
//           {
//             segmentId: '2',
//             cabin: 'ECONOMY',
//             fareBasis: 'TPROMO',
//             class: 'T'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     type: 'flight-offer',
//     id: '3',
//     source: 'GDS',
//     instantTicketingRequired: true,
//     nonHomogeneous: false,
//     oneWay: true,
//     lastTicketingDate: '2024-02-15',
//     numberOfBookableSeats: 2,
//     itineraries: [
//       {
//         duration: 'PT11H45M',
//         segments: [
//           {
//             departure: {
//               iataCode: 'IST',
//               at: '2024-02-20T08:15:00'
//             },
//             arrival: {
//               iataCode: 'JFK',
//               at: '2024-02-20T15:00:00'
//             },
//             carrierCode: 'DL',
//             number: '241',
//             duration: 'PT11H45M',
//             numberOfStops: 0,
//             aircraft: {
//               code: '333'
//             }
//           }
//         ]
//       }
//     ],
//     price: {
//       currency: 'USD',
//       total: '789.25',
//       base: '695.00',
//       fees: [
//         {
//           amount: '94.25',
//           type: 'SUPPLIER'
//         }
//       ],
//       grandTotal: '789.25'
//     },
//     pricingOptions: {
//       fareType: ['PUBLISHED'],
//       includedCheckedBagsOnly: true
//     },
//     validatingAirlineCodes: ['DL'],
//     travelerPricings: [
//       {
//         travelerId: '1',
//         fareOption: 'STANDARD',
//         travelerType: 'ADULT',
//         price: {
//           currency: 'USD',
//           total: '789.25',
//           base: '695.00',
//           fees: [
//             {
//               amount: '94.25',
//               type: 'SUPPLIER'
//             }
//           ],
//           grandTotal: '789.25'
//         },
//         fareDetailsBySegment: [
//           {
//             segmentId: '1',
//             cabin: 'ECONOMY',
//             fareBasis: 'MAIN',
//             class: 'M',
//             includedCheckedBags: {
//               quantity: 1
//             }
//           }
//         ]
//       }
//     ]
//   }
// ];

// export const searchFlights = async (params: SearchParams): Promise<FlightSearchResponse> => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1500));

//   // Filter mock data based on search params
//   let filteredData = MOCK_FLIGHT_DATA.filter(offer => {
//     const firstSegment = offer.itineraries[0].segments[0];
//     const lastSegment = offer.itineraries[offer.itineraries.length - 1].segments[
//       offer.itineraries[offer.itineraries.length - 1].segments.length - 1
//     ];

//     return (
//       firstSegment.departure.iataCode === params.originLocationCode.toUpperCase() &&
//       lastSegment.arrival.iataCode === params.destinationLocationCode.toUpperCase()
//     );
//   });

//   // Sort by price ascending
//   filteredData = filteredData.sort((a, b) =>
//     parseFloat(a.price.total) - parseFloat(b.price.total)
//   );

//   return {
//     meta: {
//       count: filteredData.length
//     },
//     data: filteredData
//   };
// };

// export const getAirlineNames = (code: string): string => {
//   const airlines: { [key: string]: string } = {
//     'TK': 'Turkish Airlines',
//     'AF': 'Air France',
//     'DL': 'Delta Air Lines',
//     'LH': 'Lufthansa',
//     'BA': 'British Airways',
//     'EK': 'Emirates',
//     'QR': 'Qatar Airways'
//   };
//   return airlines[code] || code;
// };