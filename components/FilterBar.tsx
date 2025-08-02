import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react-native';
import { FilterOptions } from '@/types/flight';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  resultCount: number;
}

export default function FilterBar({ filters, onFiltersChange, resultCount }: FilterBarProps) {
  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.resultCount}>{resultCount} flights found</Text>
        <TouchableOpacity style={styles.sortButton}>
          <ArrowUpDown size={16} color="#6B7280" />
          <Text style={styles.sortText}>Price</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            filters.tripType !== 'all' && styles.filterChipActive
          ]}
          onPress={() => updateFilter('tripType', filters.tripType === 'all' ? 'roundTrip' : 'all')}
        >
          <Text style={[
            styles.filterChipText,
            filters.tripType !== 'all' && styles.filterChipTextActive
          ]}>
            Round Trip
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filters.refundableOnly && styles.filterChipActive
          ]}
          onPress={() => updateFilter('refundableOnly', !filters.refundableOnly)}
        >
          <Text style={[
            styles.filterChipText,
            filters.refundableOnly && styles.filterChipTextActive
          ]}>
            Refundable
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            filters.checkedBagsOnly && styles.filterChipActive
          ]}
          onPress={() => updateFilter('checkedBagsOnly', !filters.checkedBagsOnly)}
        >
          <Text style={[
            styles.filterChipText,
            filters.checkedBagsOnly && styles.filterChipTextActive
          ]}>
            Checked Bags
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sortText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: 'white',
  },
});