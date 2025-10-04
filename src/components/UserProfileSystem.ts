// 사용자 프로필 및 배지 시스템 관리

export interface Badge {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  gameType: 'fretboard-match' | 'chord-input';
  icon: string;
  color: string;
  unlockedAt?: Date;
}

export interface UserProfile {
  nickname: string;
  createdAt: Date;
  lastPlayed: Date;
  badges: Badge[];
  highScores: {
    fretboardMatch: { [level: string]: number };
    chordInput: { [level: string]: number };
  };
  gameProgress: {
    fretboardMatch: { [level: string]: number }; // 완료한 세트 수
    chordInput: { [level: string]: number };
  };
}

export interface ScoreEntry {
  nickname: string;
  score: number;
  level: string;
  gameType: string;
  achievedAt: Date;
}

// 모든 배지 정의
export const ALL_BADGES: Badge[] = [
  // 짝짓기 게임 배지
  {
    id: 'fretboard-beginner',
    name: '코드 입문자',
    description: '초급 짝짓기 게임 5세트 완료',
    level: 'beginner',
    gameType: 'fretboard-match',
    icon: '🎸',
    color: 'bg-green-500'
  },
  {
    id: 'fretboard-intermediate',
    name: '코드 연습생',
    description: '중급 짝짓기 게임 5세트 완료',
    level: 'intermediate',
    gameType: 'fretboard-match',
    icon: '🎯',
    color: 'bg-blue-500'
  },
  {
    id: 'fretboard-advanced',
    name: '코드 마스터',
    description: '고급 짝짓기 게임 5세트 완료',
    level: 'advanced',
    gameType: 'fretboard-match',
    icon: '👑',
    color: 'bg-purple-500'
  },
  
  // 코드 입력 게임 배지
  {
    id: 'input-beginner',
    name: '지판 탐험가',
    description: '초급 코드 입력 게임 5세트 완료',
    level: 'beginner',
    gameType: 'chord-input',
    icon: '🗺️',
    color: 'bg-orange-500'
  },
  {
    id: 'input-intermediate',
    name: '지판 숙련자',
    description: '중급 코드 입력 게임 5세트 완료',
    level: 'intermediate',
    gameType: 'chord-input',
    icon: '⚡',
    color: 'bg-yellow-500'
  },
  {
    id: 'input-advanced',
    name: '지판 대가',
    description: '고급 코드 입력 게임 5세트 완료',
    level: 'advanced',
    gameType: 'chord-input',
    icon: '🏆',
    color: 'bg-red-500'
  }
];

// 난이도별 코드 분류
export const CHORD_LEVELS = {
  beginner: ['C', 'D', 'E', 'G', 'A', 'Em', 'Am', 'Dm'],
  intermediate: ['F', 'B', 'Cm', 'Fm', 'Gm', 'Bm', 'C7', 'D7', 'E7', 'G7', 'A7', 'B7'],
  advanced: ['Cm7', 'Dm7', 'Em7', 'Fm7', 'Gm7', 'Am7', 'Bm7', 'Cmaj7', 'Dmaj7', 'Emaj7', 'Fmaj7', 'Gmaj7', 'Amaj7', 'Bmaj7', 'Csus2', 'Csus4', 'Dsus2', 'Dsus4', 'Esus2', 'Esus4', 'Asus2', 'Asus4', 'Cdim', 'Ddim', 'Edim', 'Gdim', 'Adim', 'Bdim', 'Cadd9', 'Dadd9', 'Gadd9', 'Aadd9', 'C6', 'D6', 'G6', 'A6']
};

class UserProfileManager {
  private static instance: UserProfileManager;
  private profile: UserProfile | null = null;

  private constructor() {
    this.loadProfile();
    this.migrateProfile();
  }

  private migrateProfile(): void {
    if (!this.profile) return;
    
    let needsSave = false;
    
    // gameProgress가 없으면 추가
    if (!this.profile.gameProgress) {
      this.profile.gameProgress = {
        fretboardMatch: { beginner: 0, intermediate: 0, advanced: 0 },
        chordInput: { beginner: 0, intermediate: 0, advanced: 0 }
      };
      needsSave = true;
    }
    
    // highScores가 없으면 추가
    if (!this.profile.highScores) {
      this.profile.highScores = {
        fretboardMatch: {},
        chordInput: {}
      };
      needsSave = true;
    }
    
    if (needsSave) {
      console.log('프로필 마이그레이션 완료');
      this.saveProfile();
    }
  }

  static getInstance(): UserProfileManager {
    if (!UserProfileManager.instance) {
      UserProfileManager.instance = new UserProfileManager();
    }
    return UserProfileManager.instance;
  }

  private loadProfile(): void {
    const saved = localStorage.getItem('guitarMasterProfile');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.profile = {
        ...parsed,
        createdAt: new Date(parsed.createdAt),
        lastPlayed: new Date(parsed.lastPlayed),
        badges: parsed.badges.map((badge: any) => ({
          ...badge,
          unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined
        })),
        // 기존 프로필에 gameProgress가 없을 경우 초기화
        gameProgress: parsed.gameProgress || {
          fretboardMatch: { beginner: 0, intermediate: 0, advanced: 0 },
          chordInput: { beginner: 0, intermediate: 0, advanced: 0 }
        },
        // 기존 프로필에 highScores가 없을 경우 초기화
        highScores: parsed.highScores || {
          fretboardMatch: {},
          chordInput: {}
        }
      };
      // 수정된 프로필 저장
      this.saveProfile();
    }
  }

  private saveProfile(): void {
    if (this.profile) {
      localStorage.setItem('guitarMasterProfile', JSON.stringify(this.profile));
    }
  }

  createProfile(nickname: string): UserProfile {
    this.profile = {
      nickname,
      createdAt: new Date(),
      lastPlayed: new Date(),
      badges: [],
      highScores: {
        fretboardMatch: {},
        chordInput: {}
      },
      gameProgress: {
        fretboardMatch: { beginner: 0, intermediate: 0, advanced: 0 },
        chordInput: { beginner: 0, intermediate: 0, advanced: 0 }
      }
    };
    this.saveProfile();
    return this.profile;
  }

  getProfile(): UserProfile | null {
    return this.profile;
  }


  updateLastPlayed(): void {
    if (this.profile) {
      this.profile.lastPlayed = new Date();
      this.saveProfile();
    }
  }

  updateHighScore(gameType: 'fretboardMatch' | 'chordInput', level: string, score: number): boolean {
    if (!this.profile) return false;

    // highScores 초기화 확인
    if (!this.profile.highScores) {
      this.profile.highScores = {
        fretboardMatch: {},
        chordInput: {}
      };
    }

    if (!this.profile.highScores[gameType]) {
      this.profile.highScores[gameType] = {};
    }

    const currentHigh = this.profile.highScores[gameType][level] || 0;
    if (score > currentHigh) {
      this.profile.highScores[gameType][level] = score;
      this.saveProfile();
      console.log(`새로운 최고점수! ${gameType} ${level}: ${currentHigh} -> ${score}`);
      return true; // 새로운 최고점수
    }
    return false;
  }

  incrementGameProgress(gameType: 'fretboardMatch' | 'chordInput', level: string): Badge | null {
    if (!this.profile) {
      console.error('프로필이 없습니다');
      return null;
    }

    // gameProgress 초기화 확인
    if (!this.profile.gameProgress) {
      this.profile.gameProgress = {
        fretboardMatch: { beginner: 0, intermediate: 0, advanced: 0 },
        chordInput: { beginner: 0, intermediate: 0, advanced: 0 }
      };
    }

    if (!this.profile.gameProgress[gameType]) {
      this.profile.gameProgress[gameType] = { beginner: 0, intermediate: 0, advanced: 0 };
    }

    // 진행도 증가
    const currentProgress = this.profile.gameProgress[gameType][level] || 0;
    this.profile.gameProgress[gameType][level] = currentProgress + 1;
    
    console.log(`${gameType} ${level} 진행도: ${currentProgress} -> ${this.profile.gameProgress[gameType][level]}`);
    
    // 5세트 완료 시 배지 확인
    if (this.profile.gameProgress[gameType][level] === 5) {
      const badgeId = gameType === 'fretboardMatch' 
        ? `fretboard-${level}` 
        : `input-${level}`;
      
      const badge = ALL_BADGES.find(b => b.id === badgeId);
      if (badge && !this.profile.badges.some(b => b.id === badgeId)) {
        const unlockedBadge = { ...badge, unlockedAt: new Date() };
        this.profile.badges.push(unlockedBadge);
        console.log('배지 획득!', unlockedBadge.name);
        this.saveProfile();
        return unlockedBadge;
      }
    }
    
    this.saveProfile();
    return null;
  }

  getUnlockedBadges(): Badge[] {
    return this.profile?.badges || [];
  }

  getBadgeProgress(gameType: 'fretboardMatch' | 'chordInput', level: string): number {
    if (!this.profile) return 0;
    if (!this.profile.gameProgress) return 0;
    if (!this.profile.gameProgress[gameType]) return 0;
    return Math.min(this.profile.gameProgress[gameType][level] || 0, 5);
  }



  // 수동 배지 획득
  claimBadge(gameType: 'fretboard-match' | 'chord-input', level: string): { success: boolean; badge?: Badge; message: string } {
    if (!this.profile) {
      return { success: false, message: '프로필이 없습니다.' };
    }

    // 배지 ID 생성 (ALL_BADGES와 일치하도록 수정)
    const badgeId = gameType === 'fretboard-match' ? `fretboard-${level}` : `input-${level}`;
    
    // 이미 배지가 있는지 확인
    const existingBadge = this.profile.badges.find(b => b.id === badgeId);
    if (existingBadge) {
      return { success: false, message: '이미 획득한 배지입니다.' };
    }

    // 배지 획득
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    if (badge) {
      const unlockedBadge = { ...badge, unlockedAt: new Date() };
      this.profile.badges.push(unlockedBadge);
      this.saveProfile();
      
      return { 
        success: true, 
        badge: unlockedBadge, 
        message: `🎉 ${badge.name} 배지를 획득했습니다!` 
      };
    }

    return { success: false, message: '배지를 찾을 수 없습니다.' };
  }

  // 리더보드용 점수 데이터
  saveScoreEntry(gameType: string, level: string, score: number): void {
    if (!this.profile) return;

    const leaderboard = this.getLeaderboard();
    const entry: ScoreEntry = {
      nickname: this.profile.nickname,
      score,
      level,
      gameType,
      achievedAt: new Date()
    };

    leaderboard.push(entry);
    
    // 상위 50개만 유지
    leaderboard.sort((a, b) => b.score - a.score);
    const topEntries = leaderboard.slice(0, 50);
    
    localStorage.setItem('guitarMasterLeaderboard', JSON.stringify(topEntries));
  }

  getLeaderboard(): ScoreEntry[] {
    const saved = localStorage.getItem('guitarMasterLeaderboard');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((entry: any) => ({
        ...entry,
        achievedAt: new Date(entry.achievedAt)
      }));
    }
    return [];
  }

  exportProfileData(): string {
    if (!this.profile) return '';
    
    const exportData = {
      profile: this.profile,
      leaderboard: this.getLeaderboard().filter(entry => 
        entry.nickname === this.profile!.nickname
      )
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

export default UserProfileManager;