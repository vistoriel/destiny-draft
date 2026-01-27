# Destiny Draft - Implementation Plan

## Overview
A character sheet draft tool for custom game systems using Next.js and Supabase. DMs create games and character slots, players claim and fill out their characters, with PDF export functionality.

## Database Schema (Supabase)

### games table
- `id` (uuid, primary key)
- `created_at` (timestamp)
- `admin_key` (text, unique) - for DM access
- `game_name` (text)
- `game_settings` (jsonb)

### characters table
- `id` (uuid, primary key)
- `game_id` (uuid, foreign key → games.id)
- `player_name` (text)
- `player_key` (text, unique, nullable) - generated when claimed
- `is_claimed` (boolean, default false)
- `claimed_at` (timestamp, nullable)
- `character_data` (jsonb) - stores all character sheet fields
- `created_at` (timestamp)

## Authentication Strategy
- **No traditional auth** - key-based access only
- **Admin key**: Generated on game creation, grants DM access
- **Player key**: Generated when character claimed, grants player access
- Keys stored hashed in database
- Session management via HTTP-only cookies or localStorage

## Application Routes

### Public Routes
- `/` - Landing page
- `/game/[gameId]` - Player lobby (select/claim character)
- `/game/[gameId]/character/[characterId]` - Character sheet form

### Protected Routes
- `/dm/[gameId]?key=[adminKey]` - DM dashboard
- `/game/[gameId]/character/[characterId]?key=[playerKey]` - Claimed character access

## Core Workflows

### 1. Game Creation (DM)
1. DM clicks "Create Game"
2. Backend generates admin_key, creates game record
3. Display game URL + admin key (warn to save)
4. Redirect to DM dashboard

### 2. Character Creation (DM)
1. DM adds player names on dashboard
2. Create character records (unclaimed, no player_key)
3. Display character list with status

### 3. Player Access
1. Player visits game URL
2. See list of all characters (claimed status)
3. Can only claim unclaimed characters

### 4. Character Claiming
1. Player clicks "Claim" on their character
2. Backend generates player_key, sets is_claimed=true
3. Store player_key in cookie/localStorage
4. Redirect to character sheet

### 5. Character Sheet Editing
1. Access with valid player_key
2. Dynamic form for character fields (JSONB)
3. Auto-save on blur/change
4. Real-time validation

### 6. PDF Export
1. Button on character sheet
2. Generate PDF using react-pdf/puppeteer
3. Download functionality

## API Routes

```
POST   /api/games/create
POST   /api/games/[gameId]/validate-admin
POST   /api/games/[gameId]/characters/create
GET    /api/games/[gameId]/characters/list

POST   /api/characters/[characterId]/claim
POST   /api/characters/[characterId]/validate-player
PATCH  /api/characters/[characterId]/update
GET    /api/characters/[characterId]/pdf
```

## Security

### Row Level Security (RLS)
- Enable RLS on both tables
- games: SELECT allowed for anyone
- characters: SELECT allowed for anyone in same game
- characters: UPDATE only via validated API calls

### Key Validation
- Hash keys before storage (never store plaintext)
- Middleware for key validation
- Rate limiting to prevent brute force
- Long, random, URL-safe keys

## UI Components

### Pages
- HomePage
- DmDashboardPage
- GameLobbyPage
- CharacterSheetPage
- KeyLoginPage

### Components
- GameCreationModal
- CharacterList
- CharacterSheetForm (dynamic)
- KeyDisplay (with copy button)
- PdfExportButton
- ClaimButton

## Technical Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **PDF Generation**: react-pdf/renderer or Puppeteer
- **Real-time** (optional): Supabase Realtime

## Development Phases

### Phase 1: Core Setup
- Next.js + TypeScript setup
- Supabase project and client
- Database schema with RLS
- Key generation utilities

### Phase 2: DM Flow
- Create game page
- DM dashboard
- Character creation
- Admin key validation

### Phase 3: Player Flow
- Game lobby page
- Character claiming
- Player key validation
- Character sheet form with auto-save

### Phase 4: Key Login
- Login page for keys
- Cookie/localStorage management
- Access restoration on new device

### Phase 5: PDF Export
- Design PDF template
- Implement PDF generation
- Download functionality

### Phase 6: Polish
- Error handling
- Loading states
- Responsive design
- UX improvements

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
KEY_ENCRYPTION_SECRET=
```

## Key Considerations

- **Character Data Structure**: Define clear schema for game system
- **Concurrency**: Handle simultaneous claims with DB constraints
- **URL Sharing**: Balance convenience vs security
- **Data Persistence**: Consider archiving and backup mechanisms
- **Real-time Updates**: DM sees when characters are claimed
