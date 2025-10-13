import DailyIframe, { DailyCall } from '@daily-co/daily-js';

/**
 * Singleton manager for Daily.co call instances
 * This prevents the "Duplicate DailyIframe instances" error in React Strict Mode
 */
class DailyManager {
  private static instance: DailyManager;
  private callObject: DailyCall | null = null;
  private isDestroying = false;

  private constructor() {}

  static getInstance(): DailyManager {
    if (!DailyManager.instance) {
      DailyManager.instance = new DailyManager();
    }
    return DailyManager.instance;
  }

  async getOrCreateCall(containerElement?: HTMLElement | null): Promise<DailyCall> {
    // Wait if we're currently destroying
    while (this.isDestroying) {
      console.log('⏳ Waiting for previous call to be destroyed...');
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Return existing call if available
    if (this.callObject) {
      console.log('♻️ Reusing existing Daily.co call object');
      return this.callObject;
    }

    // Create new call object with frame if container provided
    console.log('🆕 Creating new Daily.co call object');
    if (containerElement) {
      console.log('📦 Creating with iframe container for reliable track access');
      this.callObject = DailyIframe.createFrame(containerElement, {
        showLeaveButton: false,
        showFullscreenButton: false,
        iframeStyle: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '0.5rem',
        },
      });
    } else {
      console.log('🎯 Creating call object without container');
      this.callObject = DailyIframe.createCallObject({
        audioSource: true,
        videoSource: true,
      });
    }

    return this.callObject;
  }

  async destroyCall(): Promise<void> {
    if (!this.callObject || this.isDestroying) {
      return;
    }

    this.isDestroying = true;
    console.log('🧹 Destroying Daily.co call object...');

    try {
      await this.callObject.destroy();
      this.callObject = null;
      console.log('✅ Daily.co call object destroyed successfully');
    } catch (error) {
      console.error('Error destroying call object:', error);
      this.callObject = null;
    } finally {
      this.isDestroying = false;
    }
  }

  getCall(): DailyCall | null {
    return this.callObject;
  }
}

export const dailyManager = DailyManager.getInstance();