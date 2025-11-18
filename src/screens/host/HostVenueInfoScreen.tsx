import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';

type Props = NativeStackScreenProps<any>;

const SPORTS = ['Badminton', 'Table Tennis', 'Cricket', 'Football', 'Snooker'];
const AMENITIES = ['Parking', 'Drinking water', 'Washroom', 'Shower', 'Turf'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const HostVenueInfoScreen: React.FC<Props> = ({ route }) => {
  const { firebaseUser, markVenueCreated } = useAuth();
  const prefillAddress = route.params?.address || {};

  const [venueName, setVenueName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState(firebaseUser?.email ?? '');
  const [contactNumber, setContactNumber] = useState('');

  const [area, setArea] = useState(prefillAddress.area ?? '');
  const [city, setCity] = useState(prefillAddress.city ?? '');
  const [landmark, setLandmark] = useState(prefillAddress.landmark ?? '');
  const [pincode, setPincode] = useState(prefillAddress.pincode ?? '');

  const [selectedSports, setSelectedSports] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [openingTime, setOpeningTime] = useState('06:00');
  const [closingTime, setClosingTime] = useState('23:00');
  const [workingDays, setWorkingDays] = useState<string[]>(DAYS);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleInArray = (value: string, arr: string[], setArr: (v: string[]) => void) => {
    if (arr.includes(value)) {
      setArr(arr.filter((v) => v !== value));
    } else {
      setArr([...arr, value]);
    }
  };

  const onSave = async () => {
    if (!firebaseUser) return;
    if (!venueName || !city) {
      setError('Please fill at least venue name and city.');
      return;
    }
    setError(null);
    setSaving(true);

    try {
      await addDoc(collection(db, 'venues'), {
        ownerId: firebaseUser.uid,
        venueName,
        ownerName,
        contactEmail: email,
        contactNumber,
        address: {
          area,
          city,
          landmark,
          pincode,
        },
        sports: selectedSports,
        amenities: selectedAmenities,
        openingTime,
        closingTime,
        workingDays,
        createdAt: serverTimestamp(),
      });

      await markVenueCreated();
    } catch (e: any) {
      setError(e.message ?? 'Failed to save venue');
    } finally {
      setSaving(false);
    }
  };

  const renderChip = (
    label: string,
    selected: boolean,
    onPress: () => void,
  ) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Venue information</Text>
      <TextInput
        style={styles.input}
        placeholder="Venue name"
        value={venueName}
        onChangeText={setVenueName}
      />
      <TextInput
        style={styles.input}
        placeholder="Owner name"
        value={ownerName}
        onChangeText={setOwnerName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contact number"
        value={contactNumber}
        onChangeText={setContactNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.sectionTitle}>Venue address details</Text>
      <TextInput
        style={styles.input}
        placeholder="Area / locality"
        value={area}
        onChangeText={setArea}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Landmark (optional)"
        value={landmark}
        onChangeText={setLandmark}
      />
      <TextInput
        style={styles.input}
        placeholder="Pincode"
        value={pincode}
        onChangeText={setPincode}
        keyboardType="number-pad"
      />

      <Text style={styles.sectionTitle}>Select the sports you provide</Text>
      <View style={styles.chipRow}>
        {SPORTS.map((s) =>
          renderChip(s, selectedSports.includes(s), () =>
            toggleInArray(s, selectedSports, setSelectedSports),
          ),
        )}
      </View>

      <Text style={styles.sectionTitle}>Select the amenities you provide</Text>
      <View style={styles.chipRow}>
        {AMENITIES.map((a) =>
          renderChip(a, selectedAmenities.includes(a), () =>
            toggleInArray(a, selectedAmenities, setSelectedAmenities),
          ),
        )}
      </View>

      <Text style={styles.sectionTitle}>Opening hours</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.timeInput]}
          placeholder="Opening (e.g. 06:00)"
          value={openingTime}
          onChangeText={setOpeningTime}
        />
        <TextInput
          style={[styles.input, styles.timeInput]}
          placeholder="Closing (e.g. 23:00)"
          value={closingTime}
          onChangeText={setClosingTime}
        />
      </View>

      <Text style={styles.sectionTitle}>Working days</Text>
      <View style={styles.chipRow}>
        {DAYS.map((d) =>
          renderChip(d, workingDays.includes(d), () =>
            toggleInArray(d, workingDays, setWorkingDays),
          ),
        )}
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.saveButton} onPress={onSave} disabled={saving}>
        <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Next'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  chipSelected: {
    borderColor: '#7B5CFF',
    backgroundColor: '#E8E0FF',
  },
  chipText: { fontSize: 13, color: '#444' },
  chipTextSelected: { color: '#4527A0', fontWeight: '600' },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  error: {
    marginTop: 8,
    color: 'red',
  },
  saveButton: {
    backgroundColor: '#7B5CFF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
