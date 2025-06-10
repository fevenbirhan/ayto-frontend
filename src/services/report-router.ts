import { Report } from './report';
import { UtilityProvider, utilityProviderService } from './utility-provider';

interface Coordinates {
  lat: number;
  lng: number;
}

export class ReportRouter {
  // Calculate distance between two points using Haversine formula
  private static calculateDistance(point1: Coordinates, point2: Coordinates): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Parse location string into coordinates
  private static parseLocation(location: string): Coordinates {
    const [lat, lng] = location.split(',').map(Number);
    return { lat, lng };
  }

  // Find the nearest utility provider of the matching type
  static async findMatchingProvider(report: Report, token: string): Promise<UtilityProvider | null> {
    try {
      console.log('Finding matching provider for report:', {
        id: report.id,
        category: report.category,
        location: report.location
      });

      // Get all utility providers
      const providers = await utilityProviderService.getAllUtilityProviders(token);
      console.log('Total providers found:', providers.length);
      
      // Filter providers by matching type and active status
      const matchingProviders = providers.filter(
        provider => provider.providerType === report.category && provider.accountStatus === 'ACTIVE'
      );
      console.log('Matching providers by type:', matchingProviders.length);

      if (matchingProviders.length === 0) {
        console.log('No matching providers found for category:', report.category);
        return null;
      }

      // Parse report location
      const reportLocation = this.parseLocation(report.location);
      console.log('Report location:', reportLocation);

      // Find the nearest provider
      let nearestProvider = matchingProviders[0];
      let shortestDistance = Number.MAX_VALUE;

      for (const provider of matchingProviders) {
        const providerLocation = this.parseLocation(provider.location);
        const distance = this.calculateDistance(reportLocation, providerLocation);
        console.log('Provider distance check:', {
          providerId: provider.id,
          name: provider.name,
          distance: distance
        });

        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestProvider = provider;
        }
      }

      console.log('Found nearest provider:', nearestProvider.name, 'at distance:', shortestDistance, 'km');
      return nearestProvider;
    } catch (error) {
      console.error('Error finding matching provider:', error);
      return null;
    }
  }

  // Route a report to the appropriate utility provider
  static async routeReport(report: Report, token: string): Promise<string | null> {
    try {
      const matchingProvider = await this.findMatchingProvider(report, token);
      
      if (!matchingProvider) {
        console.error('No matching provider found for report:', report.id);
        return null;
      }

      return matchingProvider.id;
    } catch (error) {
      console.error('Error routing report:', error);
      return null;
    }
  }
} 