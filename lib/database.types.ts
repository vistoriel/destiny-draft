// Database types for TypeScript support

export interface Database {
  public: {
    Tables: {
      games: {
        Row: {
          id: string;
          created_at: string;
          admin_key_hash: string;
          game_name: string;
          game_settings: Record<string, unknown> | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          admin_key_hash: string;
          game_name: string;
          game_settings?: Record<string, unknown> | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          admin_key_hash?: string;
          game_name?: string;
          game_settings?: Record<string, unknown> | null;
        };
      };
      characters: {
        Row: {
          id: string;
          game_id: string;
          player_name: string;
          player_key_hash: string | null;
          is_claimed: boolean;
          claimed_at: string | null;
          character_data: Record<string, unknown> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          game_id: string;
          player_name: string;
          player_key_hash?: string | null;
          is_claimed?: boolean;
          claimed_at?: string | null;
          character_data?: Record<string, unknown> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          game_id?: string;
          player_name?: string;
          player_key_hash?: string | null;
          is_claimed?: boolean;
          claimed_at?: string | null;
          character_data?: Record<string, unknown> | null;
          created_at?: string;
        };
      };
    };
  };
}
