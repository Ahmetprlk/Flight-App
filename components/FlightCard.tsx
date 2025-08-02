import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated
} from 'react-native';
import { ChevronDown, ChevronUp, Plane, Clock, MapPin } from 'lucide-react-native';
import { FlightOffer } from '@/types/flight';
import { formatDateTime, formatDate, formatDuration, getStopText } from '@/utils/dateFormatter';
import { getAirlineNames } from '@/services/flightApi';

interface FlightCardProps {
  offer: FlightOffer;
  onPress: () => void;
}

export default function FlightCard({ offer, onPress }: FlightCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  const firstItinerary = offer.itineraries[0];
  const firstSegment = firstItinerary.segments[0];
  const lastSegment = firstItinerary.segments[firstItinerary.segments.length - 1];
  const totalStops = firstItinerary.segments.reduce((acc, segment) => acc + segment.numberOfStops, 0);

  const toggleExpanded = () => {
    const toValue = expanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.routeInfo}>
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatDateTime(firstSegment.departure.at)}</Text>
            <Text style={styles.airport}>{firstSegment.departure.iataCode}</Text>
          </View>
          
          <View style={styles.flightPath}>
            <View style={styles.flightLine} />
            <Plane size={16} color="#6B7280" />
            <View style={styles.flightLine} />
          </View>
          
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatDateTime(lastSegment.arrival.at)}</Text>
            <Text style={styles.airport}>{lastSegment.arrival.iataCode}</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {offer.price.currency} {parseFloat(offer.price.total).toFixed(0)}
          </Text>
          <Text style={styles.priceLabel}>per person</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.flightInfo}>
          <View style={styles.infoItem}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.infoText}>{formatDuration(firstItinerary.duration)}</Text>
          </View>
          <View style={styles.infoItem}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.infoText}>{getStopText(totalStops)}</Text>
          </View>
          <Text style={styles.airline}>
            {getAirlineNames(firstSegment.carrierCode)} {firstSegment.number}
          </Text>
        </View>

        <TouchableOpacity onPress={toggleExpanded} style={styles.expandButton}>
          <Text style={styles.expandText}>
            {expanded ? 'Less details' : 'More details'}
          </Text>
          {expanded ? (
            <ChevronUp size={16} color="#2563EB" />
          ) : (
            <ChevronDown size={16} color="#2563EB" />
          )}
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.expandedContent, { height: animatedHeight }]}>
        <View style={styles.expandedDetails}>
          <Text style={styles.expandedTitle}>Flight Details</Text>
          
          {firstItinerary.segments.map((segment, index) => (
            <View key={index} style={styles.segmentRow}>
              <Text style={styles.segmentText}>
                {segment.departure.iataCode} → {segment.arrival.iataCode}
              </Text>
              <Text style={styles.segmentTime}>
                {formatDateTime(segment.departure.at)} - {formatDateTime(segment.arrival.at)}
              </Text>
              <Text style={styles.segmentFlight}>
                {getAirlineNames(segment.carrierCode)} {segment.number}
              </Text>
            </View>
          ))}

          <View style={styles.fareDetails}>
            <Text style={styles.fareTitle}>Fare Breakdown</Text>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Base Price:</Text>
              <Text style={styles.fareValue}>{offer.price.currency} {offer.price.base}</Text>
            </View>
            <View style={styles.fareRow}>
              <Text style={styles.fareLabel}>Taxes & Fees:</Text>
              <Text style={styles.fareValue}>
                {offer.price.currency} {(parseFloat(offer.price.total) - parseFloat(offer.price.base)).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.fareRow, styles.fareTotal]}>
              <Text style={styles.fareTotalLabel}>Total:</Text>
              <Text style={styles.fareTotalValue}>{offer.price.currency} {offer.price.total}</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {offer.pricingOptions.includedCheckedBagsOnly && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✓ Checked bag included</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    alignItems: 'center',
  },
  time: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  airport: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  flightPath: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  flightLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D5DB',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flightInfo: {
    flex: 1,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  airline: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    marginTop: 4,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expandText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginRight: 4,
  },
  expandedContent: {
    overflow: 'hidden',
  },
  expandedDetails: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  expandedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  segmentRow: {
    marginBottom: 8,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  segmentTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  segmentFlight: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  fareDetails: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  fareTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  fareLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  fareValue: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  fareTotal: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  fareTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  fareTotalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '500',
  },
});