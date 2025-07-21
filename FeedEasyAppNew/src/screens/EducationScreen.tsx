import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const EducationScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('feeding');

  const categories = [
    { id: 'feeding', title: 'Feeding Practices', icon: '🌾' },
    { id: 'health', title: 'Animal Health', icon: '🏥' },
    { id: 'breeding', title: 'Breeding Tips', icon: '🐄' },
    { id: 'management', title: 'Farm Management', icon: '🚜' },
  ];

  const educationalContent = {
    feeding: [
      {
        id: '1',
        title: 'Optimal Feeding Schedule for Dairy Cows',
        content: 'Feed dairy cows 3-4 times daily with 16-18% protein content feed. Provide fresh water constantly.',
        readTime: '5 min read',
        language: 'English',
      },
      {
        id: '2',
        title: 'Poultry Nutrition Guidelines',
        content: 'Layer hens require 16-18% protein, while broilers need 20-23% during starter phase.',
        readTime: '4 min read',
        language: 'Swahili',
      },
      {
        id: '3',
        title: 'Fish Feeding Best Practices',
        content: 'Feed fish 2-3% of their body weight daily. Use floating pellets for better monitoring.',
        readTime: '3 min read',
        language: 'English',
      },
    ],
    health: [
      {
        id: '4',
        title: 'Common Poultry Diseases Prevention',
        content: 'Maintain clean coops, provide vaccination schedules, and watch for early symptoms.',
        readTime: '6 min read',
        language: 'English',
      },
      {
        id: '5',
        title: 'Cattle Health Monitoring',
        content: 'Check body temperature, appetite, and milk production daily for early disease detection.',
        readTime: '5 min read',
        language: 'Swahili',
      },
    ],
    breeding: [
      {
        id: '6',
        title: 'Dairy Cow Breeding Cycle',
        content: 'Optimal breeding age is 15-18 months. Heat cycle lasts 18-24 hours every 21 days.',
        readTime: '7 min read',
        language: 'English',
      },
      {
        id: '7',
        title: 'Poultry Hatching Guide',
        content: 'Incubation period is 21 days. Maintain temperature at 37.5°C and humidity at 60%.',
        readTime: '5 min read',
        language: 'Swahili',
      },
    ],
    management: [
      {
        id: '8',
        title: 'Record Keeping for Farmers',
        content: 'Track feed consumption, production data, health records, and financial records daily.',
        readTime: '4 min read',
        language: 'English',
      },
      {
        id: '9',
        title: 'Seasonal Farm Planning',
        content: 'Plan feed purchases according to dry and rainy seasons. Store feed properly to prevent spoilage.',
        readTime: '6 min read',
        language: 'Swahili',
      },
    ],
  };

  const renderContent = () => {
    const content = educationalContent[selectedCategory as keyof typeof educationalContent] || [];
    
    return content.map((item) => (
      <TouchableOpacity key={item.id} style={styles.contentCard}>
        <View style={styles.contentHeader}>
          <Text style={styles.contentTitle}>{item.title}</Text>
          <View style={styles.languageBadge}>
            <Text style={styles.languageText}>{item.language}</Text>
          </View>
        </View>
        <Text style={styles.contentPreview}>{item.content}</Text>
        <View style={styles.contentFooter}>
          <Text style={styles.readTime}>{item.readTime}</Text>
          <TouchableOpacity style={styles.readButton}>
            <Text style={styles.readButtonText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Educational Resources</Text>
        <Text style={styles.headerSubtitle}>Learn modern farming techniques</Text>
      </View>

      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryCard,
                selectedCategory === category.id && styles.selectedCategoryCard
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={[
                styles.categoryTitle,
                selectedCategory === category.id && styles.selectedCategoryTitle
              ]}>
                {category.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionInfo}>
          <Text style={styles.sectionTitle}>
            {categories.find(c => c.id === selectedCategory)?.title}
          </Text>
          <Text style={styles.sectionDescription}>
            Expert advice and practical tips for improving your farming practices
          </Text>
        </View>

        {renderContent()}

        <View style={styles.additionalResources}>
          <Text style={styles.resourcesTitle}>Additional Resources</Text>
          
          <TouchableOpacity style={styles.resourceCard}>
            <Text style={styles.resourceIcon}>📱</Text>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>FeedEasy Mobile App</Text>
              <Text style={styles.resourceDescription}>Download our app for offline access to guides</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard}>
            <Text style={styles.resourceIcon}>📞</Text>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Expert Consultation</Text>
              <Text style={styles.resourceDescription}>Call +254 700 123 456 for free farming advice</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resourceCard}>
            <Text style={styles.resourceIcon}>🎥</Text>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>Video Tutorials</Text>
              <Text style={styles.resourceDescription}>Watch step-by-step farming demonstrations</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2e7d32',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#c8e6c9',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginLeft: 15,
    alignItems: 'center',
    minWidth: 100,
  },
  selectedCategoryCard: {
    backgroundColor: '#2e7d32',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  categoryTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedCategoryTitle: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  sectionInfo: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  languageBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  languageText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '500',
  },
  contentPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  contentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readTime: {
    fontSize: 12,
    color: '#999',
  },
  readButton: {
    backgroundColor: '#2e7d32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  readButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  additionalResources: {
    marginTop: 20,
    marginBottom: 30,
  },
  resourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  resourceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resourceIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default EducationScreen;
