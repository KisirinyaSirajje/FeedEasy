import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme/colors';

interface EducationTopic {
  id: string;
  title: string;
  description: string;
  category: 'poultry' | 'pig' | 'cattle' | 'fish' | 'general';
  duration: string;
  type: 'video' | 'audio' | 'article';
  language: 'english' | 'luganda' | 'swahili';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export const EducationScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { id: 'poultry', name: 'Poultry', icon: '🐔' },
    { id: 'pig', name: 'Pig', icon: '🐷' },
    { id: 'cattle', name: 'Cattle', icon: '🐄' },
    { id: 'fish', name: 'Fish', icon: '🐟' },
    { id: 'general', name: 'General', icon: '📚' },
  ];

  const topics: EducationTopic[] = [
    {
      id: '1',
      title: 'Proper Feeding Schedule for Layers',
      description: 'Learn the optimal feeding times and quantities for laying hens',
      category: 'poultry',
      duration: '15 min',
      type: 'video',
      language: 'english',
      difficulty: 'beginner',
    },
    {
      id: '2',
      title: 'Pig Nutrition Basics',
      description: 'Understanding nutritional requirements for different pig growth stages',
      category: 'pig',
      duration: '12 min',
      type: 'audio',
      language: 'luganda',
      difficulty: 'beginner',
    },
    {
      id: '3',
      title: 'Signs of Quality Feed',
      description: 'How to identify good quality animal feed and avoid adulterated products',
      category: 'general',
      duration: '8 min',
      type: 'article',
      language: 'english',
      difficulty: 'beginner',
    },
    {
      id: '4',
      title: 'Cattle Feed Storage Best Practices',
      description: 'Proper storage techniques to maintain feed quality',
      category: 'cattle',
      duration: '20 min',
      type: 'video',
      language: 'swahili',
      difficulty: 'intermediate',
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'audio':
        return '🎧';
      case 'article':
        return '📖';
      default:
        return '📄';
    }
  };

  const getLanguageFlag = (language: string) => {
    switch (language) {
      case 'english':
        return '🇬🇧';
      case 'luganda':
        return '🇺🇬';
      case 'swahili':
        return '🇰🇪';
      default:
        return '🌍';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return colors.success;
      case 'intermediate':
        return colors.warning;
      case 'advanced':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const filteredTopics = selectedCategory
    ? topics.filter(topic => topic.category === selectedCategory)
    : topics;

  const renderCategoryFilter = () => (
    <View style={styles.categoryFilter}>
      <TouchableOpacity
        style={[
          styles.categoryButton,
          !selectedCategory && styles.categoryButtonActive,
        ]}
        onPress={() => setSelectedCategory(null)}
      >
        <Text
          style={[
            styles.categoryButtonText,
            !selectedCategory && styles.categoryButtonTextActive,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory === category.id && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === category.id && styles.categoryButtonTextActive,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderTopicItem = ({ item }: { item: EducationTopic }) => (
    <TouchableOpacity style={styles.topicCard}>
      <View style={styles.topicHeader}>
        <View style={styles.topicMeta}>
          <Text style={styles.typeIcon}>{getTypeIcon(item.type)}</Text>
          <Text style={styles.languageFlag}>{getLanguageFlag(item.language)}</Text>
          <Text style={styles.duration}>{item.duration}</Text>
        </View>
        <View
          style={[
            styles.difficultyBadge,
            { backgroundColor: getDifficultyColor(item.difficulty) },
          ]}
        >
          <Text style={styles.difficultyText}>
            {item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={styles.topicTitle}>{item.title}</Text>
      <Text style={styles.topicDescription}>{item.description}</Text>

      <View style={styles.topicFooter}>
        <Text style={styles.categoryTag}>
          {categories.find(cat => cat.id === item.category)?.icon}{' '}
          {categories.find(cat => cat.id === item.category)?.name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learn & Improve</Text>
        <Text style={styles.subtitle}>
          Educational resources to help you succeed
        </Text>
      </View>

      {renderCategoryFilter()}

      <FlatList
        data={filteredTopics}
        renderItem={renderTopicItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.topicsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No content available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new educational content
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    padding: spacing.md,
    backgroundColor: colors.primary,
  },
  
  title: {
    ...typography.h3,
    color: colors.textOnPrimary,
    marginBottom: spacing.xs,
  },
  
  subtitle: {
    ...typography.body2,
    color: colors.textOnPrimary,
    opacity: 0.9,
  },
  
  categoryFilter: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
  },
  
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.round,
    backgroundColor: colors.background,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  categoryButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  categoryIcon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  
  categoryButtonText: {
    ...typography.body2,
    color: colors.text,
    fontWeight: '600',
  },
  
  categoryButtonTextActive: {
    color: colors.textOnPrimary,
  },
  
  topicsList: {
    padding: spacing.md,
  },
  
  topicCard: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  topicMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  typeIcon: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  
  languageFlag: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  
  duration: {
    ...typography.caption,
    color: colors.textSecondary,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  
  difficultyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  
  difficultyText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  
  topicTitle: {
    ...typography.h4,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  
  topicDescription: {
    ...typography.body2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  
  topicFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  categoryTag: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  
  emptyText: {
    ...typography.h4,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  
  emptySubtext: {
    ...typography.body2,
    color: colors.textLight,
    textAlign: 'center',
  },
});
