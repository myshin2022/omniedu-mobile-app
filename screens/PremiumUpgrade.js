// screens/PremiumUpgrade.js
// OmniEdu Global Tutor - Apple In-App Purchase Premium Screen

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PremiumUpgrade = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly');

  const plans = [
    {
      id: 'monthly',
      title: 'Monthly Plan',
      price: '$11.99',
      period: '/month',
      appleProductId: 'com.omniedu.premium.monthly',
      features: [
        'Unlimited AI Tutor Sessions',
        'All Subject Access',
        'Advanced Progress Analytics',
        'Priority Support',
        'Offline Content Access'
      ]
    },
    {
      id: 'yearly',
      title: 'Yearly Plan',
      price: '$89.99',
      period: '/year',
      savings: 'Save 37%',
      appleProductId: 'com.omniedu.premium.yearly',
      features: [
        'All Monthly Features',
        '4 Months FREE',
        'Premium Course Library',
        'Exclusive Study Materials',
        'Achievement Certificates'
      ]
    }
  ];

  const handlePurchase = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    Alert.alert(
      'Subscribe to Premium',
      `${plan.title} for ${plan.price}${plan.period}\n\nYou will be charged through your Apple ID account. Subscription automatically renews unless cancelled.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe via App Store',
          onPress: () => handleAppleInAppPurchase(plan)
        }
      ]
    );
  };

  const handleAppleInAppPurchase = async (plan) => {
    try {
      // TODO: 실제 Apple In-App Purchase 구현
      // import * as InAppPurchases from 'expo-in-app-purchases';

      // 시뮬레이션: Apple 결제 프로세스
      Alert.alert('Processing', 'Connecting to App Store...', [], { cancelable: false });

      setTimeout(() => {
        Alert.alert(
          'Premium Activated!',
          `Welcome to OmniEdu Premium!\n\n✅ ${plan.title} activated\n✅ All premium features unlocked\n✅ Receipt sent to your Apple ID email`,
          [
            {
              text: 'Start Learning',
              onPress: () => navigation.goBack()
            }
          ]
        );
      }, 2000);

      // 실제 구현 시:
      /*
      const { responseCode, results } = await InAppPurchases.purchaseItemAsync(plan.appleProductId);
      if (responseCode === InAppPurchases.IAPResponseCode.OK) {
        // 구매 성공 처리
        // 서버에 영수증 검증 요청
        // 사용자 프리미엄 상태 업데이트
      }
      */
    } catch (error) {
      console.error('Apple In-App Purchase Error:', error);
      Alert.alert('Purchase Failed', 'Unable to complete purchase. Please try again.');
    }
  };

  const restorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'This will restore any previous premium subscriptions purchased with this Apple ID.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restore',
          onPress: () => {
            // TODO: 실제 구매 복원 구현
            Alert.alert('Restore Complete', 'Your premium subscription has been restored!');
          }
        }
      ]
    );
  };

  const viewTerms = () => {
    Alert.alert(
      'Terms & Privacy',
      'By subscribing, you agree to our Terms of Service and Privacy Policy.\n\n• Payment charged to Apple ID\n• Subscription auto-renews\n• Cancel anytime in Settings\n• No refunds for partial periods',
      [{ text: 'OK' }]
    );
  };

  const renderPlan = (plan) => (
    <TouchableOpacity
      key={plan.id}
      style={[
        styles.planContainer,
        selectedPlan === plan.id && styles.selectedPlan
      ]}
      onPress={() => setSelectedPlan(plan.id)}
    >
      <View style={styles.planHeader}>
        <Text style={styles.planTitle}>{plan.title}</Text>
        {plan.savings && (
          <View style={styles.savingsTag}>
            <Text style={styles.savingsText}>{plan.savings}</Text>
          </View>
        )}
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>{plan.price}</Text>
        <Text style={styles.period}>{plan.period}</Text>
      </View>

      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.checkmark}>✓</Text>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {selectedPlan === plan.id && (
        <View style={styles.selectedIndicator}>
          <Ionicons name="checkmark-circle" size={24} color="#FFA726" />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#7f8c8d" />
          </TouchableOpacity>

          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Unlock unlimited learning potential with AI-powered education
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {plans.map(renderPlan)}
        </View>

        <TouchableOpacity style={styles.purchaseButton} onPress={handlePurchase}>
          <Ionicons name="card" size={20} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.purchaseButtonText}>
            Subscribe via App Store - {plans.find(p => p.id === selectedPlan)?.price}
            {plans.find(p => p.id === selectedPlan)?.period}
          </Text>
        </TouchableOpacity>

        <View style={styles.benefitsContainer}>
          <Text style={styles.benefitsTitle}>Why Premium?</Text>
          <View style={styles.benefitItem}>
            <Ionicons name="infinity" size={20} color="#FFA726" />
            <Text style={styles.benefitText}>Unlimited AI Tutor conversations</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="school" size={20} color="#FFA726" />
            <Text style={styles.benefitText}>Access to all subjects and levels</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="analytics" size={20} color="#FFA726" />
            <Text style={styles.benefitText}>Detailed learning analytics</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="download" size={20} color="#FFA726" />
            <Text style={styles.benefitText}>Offline content access</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.restoreButton} onPress={restorePurchases}>
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.termsButton} onPress={viewTerms}>
            <Text style={styles.termsButtonText}>Terms & Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            🍎 Subscription managed by Apple{'\n'}
            💳 Charged to your Apple ID account{'\n'}
            🔄 Auto-renews until cancelled{'\n'}
            ⚙️ Manage in iPhone Settings → Apple ID → Subscriptions
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    marginBottom: 30,
  },
  planContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  selectedPlan: {
    borderColor: '#FFA726',
    backgroundColor: '#fff8f0',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  savingsTag: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFA726',
  },
  period: {
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkmark: {
    color: '#27ae60',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
  },
  purchaseButton: {
    backgroundColor: '#FFA726',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#FFA726',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  benefitsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  benefitsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 12,
  },
  actionsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  restoreButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  restoreButtonText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  termsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  termsButtonText: {
    fontSize: 14,
    color: '#7f8c8d',
    textDecorationLine: 'underline',
  },
  footerInfo: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default PremiumUpgrade;
