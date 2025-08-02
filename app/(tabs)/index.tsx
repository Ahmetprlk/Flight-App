import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  SafeAreaView
} from 'react-native';
import { useRouter } from 'expo-router';
import SearchForm from '@/components/SearchForm';
import FilterBar from '@/components/FilterBar';
import FlightCard from '@/components/FlightCard';
import { FlightOffer, SearchParams, FilterOptions } from '@/types/flight';
import { searchFlights } from '@/services/flightApi';

export default function SearchScreen() {
  const router = useRouter();
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    sortBy: 'price',
    tripType: 'all',
    refundableOnly: false,
    checkedBagsOnly: false,
  });

  const handleSearch = async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchFlights(params);
      setFlights(response.data);
    } catch (err) {
      setError('Failed to search flights. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = useMemo(() => {
    let filtered = [...flights];

    // Apply trip type filter
    if (filters.tripType === 'oneWay') {
      filtered = filtered.filter(flight => flight.oneWay);
    } else if (filters.tripType === 'roundTrip') {
      filtered = filtered.filter(flight => !flight.oneWay);
    }

    // Apply refundable filter
    if (filters.refundableOnly) {
      filtered = filtered.filter(flight => 
        flight.pricingOptions.fareType.includes('REFUNDABLE')
      );
    }

    // Apply checked bags filter
    if (filters.checkedBagsOnly) {
      filtered = filtered.filter(flight => 
        flight.pricingOptions.includedCheckedBagsOnly
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price':
          return parseFloat(a.price.total) - parseFloat(b.price.total);
        case 'duration':
          return a.itineraries[0].duration.localeCompare(b.itineraries[0].duration);
        default:
          return 0;
      }
    });

    return filtered;
  }, [flights, filters]);

  const handleFlightPress = (flight: FlightOffer) => {
    // Navigate to details screen with flight data
    router.push({
      pathname: '/(tabs)/details',
      params: { flightId: flight.id, flightData: JSON.stringify(flight) }
    });
  };

  const renderFlightCard = ({ item }: { item: FlightOffer }) => (
    <FlightCard
      offer={item}
      onPress={() => handleFlightPress(item)}
    />
  );

  const renderEmptyState = () => {
    if (!hasSearched) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Ready to find your next flight?</Text>
          <Text style={styles.emptyText}>
            Enter your departure and arrival airports to get started
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    if (filteredFlights.length === 0 && flights.length > 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No flights match your filters</Text>
          <Text style={styles.emptyText}>
            Try adjusting your filter preferences
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No flights found</Text>
        <Text style={styles.emptyText}>
          Try searching with different airport codes
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchForm onSearch={handleSearch} loading={loading} />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Searching for flights...</Text>
        </View>
      )}

      {!loading && hasSearched && flights.length > 0 && (
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={filteredFlights.length}
        />
      )}

      <FlatList
        data={filteredFlights}
        renderItem={renderFlightCard}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        contentContainerStyle={[
          styles.listContainer,
          filteredFlights.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});