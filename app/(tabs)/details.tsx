import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plane, Clock, MapPin, CreditCard, Users } from 'lucide-react-native';
import { FlightOffer } from '@/types/flight';
import { formatDateTime, formatDate, formatDuration, getStopText } from '@/utils/dateFormatter';
//import { getAirlineNames } from '@/services/flightApi';

export default function FlightDetailsScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  
  if (!params.flightData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Flight details not available</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const flight: FlightOffer = JSON.parse(params.flightData as string);
  const travelerPricing = flight.travelerPricings[0];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Flight Details</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Flight Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Flight Overview</Text>
          <View style={styles.overviewCard}>
            <View style={styles.routeHeader}>
              <View style={styles.routePoint}>
                <Text style={styles.routeCode}>{flight.itineraries[0].segments[0].departure.iataCode}</Text>
                <Text style={styles.routeTime}>
                  {formatDateTime(flight.itineraries[0].segments[0].departure.at)}
                </Text>
                <Text style={styles.routeDate}>
                  {formatDate(flight.itineraries[0].segments[0].departure.at)}
                </Text>
              </View>
              
              <View style={styles.routePath}>
                <View style={styles.routeLine} />
                <Plane size={20} color="#2563EB" />
                <View style={styles.routeLine} />
              </View>
              
              <View style={styles.routePoint}>
                <Text style={styles.routeCode}>
                  {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode}
                </Text>
                <Text style={styles.routeTime}>
                  {formatDateTime(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at)}
                </Text>
                <Text style={styles.routeDate}>
                  {formatDate(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at)}
                </Text>
              </View>
            </View>

            <View style={styles.overviewDetails}>
              <View style={styles.overviewItem}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.overviewText}>{formatDuration(flight.itineraries[0].duration)}</Text>
              </View>
              <View style={styles.overviewItem}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.overviewText}>
                  {getStopText(flight.itineraries[0].segments.reduce((acc, seg) => acc + seg.numberOfStops, 0))}
                </Text>
              </View>
              <View style={styles.overviewItem}>
                <Users size={16} color="#6B7280" />
                <Text style={styles.overviewText}>{flight.numberOfBookableSeats} seats available</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Itinerary Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itinerary</Text>
          {flight.itineraries.map((itinerary, itineraryIndex) => (
            <View key={itineraryIndex} style={styles.itineraryCard}>
              <Text style={styles.itineraryTitle}>
                {itineraryIndex === 0 ? 'Outbound' : 'Return'} Journey
              </Text>
              
              {itinerary.segments.map((segment, segmentIndex) => (
                <View key={segmentIndex} style={styles.segmentCard}>
                  <View style={styles.segmentHeader}>
                    <Text style={styles.airlineName}>
                      {/* {getAirlineNames(segment.carrierCode)} {segment.number} */}
                    </Text>
                    <Text style={styles.segmentDuration}>
                      {formatDuration(segment.duration)}
                    </Text>
                  </View>
                  
                  <View style={styles.segmentRoute}>
                    <View style={styles.segmentPoint}>
                      <Text style={styles.segmentCode}>{segment.departure.iataCode}</Text>
                      <Text style={styles.segmentTime}>{formatDateTime(segment.departure.at)}</Text>
                    </View>
                    
                    <View style={styles.segmentLine}>
                      <View style={styles.segmentDot} />
                      <View style={styles.segmentConnector} />
                      <View style={styles.segmentDot} />
                    </View>
                    
                    <View style={styles.segmentPoint}>
                      <Text style={styles.segmentCode}>{segment.arrival.iataCode}</Text>
                      <Text style={styles.segmentTime}>{formatDateTime(segment.arrival.at)}</Text>
                    </View>
                  </View>
                  
                  {segment.aircraft && (
                    <Text style={styles.aircraftInfo}>Aircraft: {segment.aircraft.code}</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Fare Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fare Details</Text>
          <View style={styles.fareCard}>
            <View style={styles.fareHeader}>
              <CreditCard size={20} color="#2563EB" />
              <Text style={styles.fareTitle}>Pricing Breakdown</Text>
            </View>
            
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base Fare</Text>
              <Text style={styles.fareValue}>{flight.price.currency} {flight.price.base}</Text>
            </View>
            
            {flight.price.fees.map((fee, index) => (
              <View key={index} style={styles.fareRow}>
                <Text style={styles.fareLabel}>{fee.type} Fees</Text>
                <Text style={styles.fareValue}>{flight.price.currency} {fee.amount}</Text>
              </View>
            ))}
            
            <View style={[styles.fareRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Price</Text>
              <Text style={styles.totalValue}>{flight.price.currency} {flight.price.total}</Text>
            </View>
          </View>
        </View>

        {/* Traveler Pricing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Traveler Details</Text>
          <View style={styles.travelerCard}>
            <View style={styles.travelerHeader}>
              <Text style={styles.travelerType}>{travelerPricing.travelerType}</Text>
              <Text style={styles.fareOption}>{travelerPricing.fareOption}</Text>
            </View>
            
            {travelerPricing.fareDetailsBySegment.map((fareDetail, index) => (
              <View key={index} style={styles.fareDetailRow}>
                <View style={styles.cabinInfo}>
                  <Text style={styles.cabinClass}>{fareDetail.cabin} Class</Text>
                  <Text style={styles.fareClass}>Fare Class: {fareDetail.class}</Text>
                </View>
                
                {fareDetail.includedCheckedBags && (
                  <View style={styles.baggageInfo}>
                    <Text style={styles.baggageText}>
                      ✓ {fareDetail.includedCheckedBags.quantity} checked bag included
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Booking Information */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Booking Information</Text>
          <View style={styles.bookingCard}>
            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Instant Ticketing</Text>
              <Text style={[
                styles.bookingValue,
                flight.instantTicketingRequired ? styles.required : styles.notRequired
              ]}>
                {flight.instantTicketingRequired ? 'Required' : 'Not Required'}
              </Text>
            </View>
            
            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Last Ticketing Date</Text>
              <Text style={styles.bookingValue}>
                {new Date(flight.lastTicketingDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.bookingRow}>
              <Text style={styles.bookingLabel}>Validating Airline</Text>
              <Text style={styles.bookingValue}>
                {/* {getAirlineNames(flight.validatingAirlineCodes[0])} */}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  lastSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  overviewCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routePoint: {
    alignItems: 'center',
    flex: 1,
  },
  routeCode: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  routeTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  routeDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  routePath: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#D1D5DB',
  },
  overviewDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '500',
  },
  itineraryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  segmentCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  segmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  airlineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  segmentDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  segmentRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  segmentPoint: {
    flex: 1,
    alignItems: 'center',
  },
  segmentCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  segmentTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  segmentLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  segmentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  segmentConnector: {
    flex: 1,
    height: 2,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 8,
  },
  aircraftInfo: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  fareCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  fareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fareTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  fareLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  fareValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    marginTop: 8,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  travelerCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  travelerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  travelerType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  fareOption: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  fareDetailRow: {
    marginBottom: 12,
  },
  cabinInfo: {
    marginBottom: 8,
  },
  cabinClass: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  fareClass: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  baggageInfo: {
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    padding: 8,
  },
  baggageText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bookingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  bookingLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookingValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  required: {
    color: '#DC2626',
  },
  notRequired: {
    color: '#059669',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});