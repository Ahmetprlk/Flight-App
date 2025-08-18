import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Search } from 'lucide-react-native';
import { SearchParams } from '@/types/flight';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

export default function SearchForm({ onSearch, loading }: SearchFormProps) {
  const [origin, setOrigin] = useState('IST');
  const [destination, setDestination] = useState('JFK');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSearch = () => {
    if (!origin.trim() || !destination.trim()) {
      Alert.alert('Error', 'Please enter both departure and arrival airport codes');
      return;
    }

    if (origin.trim().length !== 3 || destination.trim().length !== 3) {
      Alert.alert('Error', 'Airport codes must be 3 characters long (e.g., IST, JFK)');
      return;
    }

    if (origin.trim().toUpperCase() === destination.trim().toUpperCase()) {
      Alert.alert('Error', 'Origin and destination cannot be the same');
      return;
    }

    onSearch({
      originLocationCode: origin.trim().toUpperCase(),
      destinationLocationCode: destination.trim().toUpperCase(),
      departureDate: date.toISOString().split('T')[0],
      adults: 1,
      max: 10
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search Flights</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          value={origin}
          onChangeText={setOrigin}
          placeholder="IST"
          placeholderTextColor="#9CA3AF"
          maxLength={3}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          value={destination}
          onChangeText={setDestination}
          placeholder="JFK"
          placeholderTextColor="#9CA3AF"
          maxLength={3}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Departure Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: '#1F2937', fontSize: 16 }}>
            {date.toISOString().split('T')[0]}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (selectedDate) setDate(selectedDate);
            }}
            minimumDate={new Date()}
          />
        )}
      </View>

      <TouchableOpacity
        style={[styles.searchButton, loading && styles.searchButtonDisabled]}
        onPress={handleSearch}
        disabled={loading}
      >
        <Search size={20} color="white" />
        <Text style={styles.searchButtonText}>
          {loading ? 'Searching...' : 'Search Flights'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});