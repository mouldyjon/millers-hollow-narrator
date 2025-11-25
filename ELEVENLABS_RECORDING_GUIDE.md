# ElevenLabs Recording Guide for Miller's Hollow Narrator

## Step 1: Choose Your Voice

Go to [ElevenLabs](https://elevenlabs.io) and sign up (free tier: 10,000 characters/month)

**Recommended Voices:**
1. **Adam** - Deep, authoritative, mysterious (BEST CHOICE)
2. **Callum** - British, slightly ominous
3. **Antoni** - Warm but dark
4. **Patrick** - Deep narrative voice

**Test phrase:** "Night falls over the village of Miller's Hollow. Everyone, close your eyes and go to sleep."

## Step 2: Voice Settings for Atmosphere

In the ElevenLabs interface, adjust these settings:

**Stability:** 70-80%
- Higher = more consistent
- Lower = more variation/emotion

**Clarity + Similarity Enhancement:** 70-75%
- Controls how clear vs atmospheric the voice is

**Style Exaggeration:** 30-40%
- Adds dramatic flair without overdoing it

**Speaker Boost:** ON
- Improves audio quality

## Step 3: Voice Prompt (Critical!)

In the "Voice Settings" or "Describe the voice" section, use this prompt:

```
You are narrating a werewolf mystery game set in a dark, eerie medieval village. 
Your tone is that of an omniscient storyteller - mysterious, slightly ominous, 
but measured and authoritative. Speak slowly and deliberately, with dramatic 
pauses between sentences. Your voice should create tension and atmosphere, 
like a Gothic horror narrator. Think of old radio dramas or Vincent Price. 
Pace yourself - this is not a rush, but a slow unfolding of dark events.
```

## Step 4: Recording Strategy

### Option A: Manual Recording (Simple)

1. Copy each text snippet from `NARRATION_SCRIPT.md`
2. Paste into ElevenLabs text box
3. Click "Generate"
4. Download MP3
5. Rename to match the filename (e.g., `night-begins.mp3`)
6. Save to `/public/audio/narration/`

**Tip:** Record in batches by theme (all werewolf lines, then all seer lines, etc.)

### Option B: Batch Generation (Faster - Paid Feature)

If you have ElevenLabs Pro ($5/month):
1. Use the API to batch generate
2. Or use Projects feature to upload all text at once

## Step 5: Recording Tips

### Add Natural Pauses
Use commas and ellipses for dramatic effect:

**Before:**
"Night falls over the village of Miller's Hollow"

**Better:**
"Night falls... over the village of Miller's Hollow."

### Emphasize Key Words
Use CAPITALS or *italics* (if supported):

**Before:**
"Werewolves, wake up"

**Better:**
"WEREWOLVES... wake up."

### Test Different Takes
Generate 2-3 versions of critical lines like "Night falls" and pick the best.

## Step 6: Priority Recording Order

Start with these essential files for testing:

**Phase 1 - Core Essentials (Test First):**
1. `night-begins.mp3` - "Night falls over the village..."
2. `werewolves-wake.mp3` - Werewolves wake up
3. `werewolves-sleep.mp3` - Werewolves sleep
4. `seer-wake.mp3` - Seer wake up
5. `seer-sleep.mp3` - Seer sleep
6. `dawn-breaks.mp3` - Dawn breaks

**Phase 2 - Common Roles:**
7. All witch lines
8. All cupid/lovers lines
9. Hunter, Little Girl
10. Fox, Bear Tamer

**Phase 3 - Advanced Roles:**
11. White Werewolf, Big Bad Wolf
12. Cursed Wolf-Father
13. Wild Child, Wolf-Hound
14. Actor, Thief

**Phase 4 - Announcements:**
15. All dawn announcements
16. Victory announcements

## Step 7: Audio Quality Settings

**Format:** MP3
**Bitrate:** 128 kbps (good balance of quality/size)
**Sample Rate:** 44.1 kHz
**Mono/Stereo:** Mono is fine (voice narration)

## Step 8: File Organization

Save files in this structure:
```
public/
  audio/
    narration/
      # Phase transitions
      night-begins.mp3
      dawn-breaks.mp3
      day-begins.mp3
      
      # Werewolves
      werewolves-wake.mp3
      werewolves-sleep.mp3
      big-bad-wolf-wake.mp3
      big-bad-wolf-sleep.mp3
      white-werewolf-wake.mp3
      white-werewolf-sleep.mp3
      
      # Village roles
      seer-wake.mp3
      seer-sleep.mp3
      witch-wake.mp3
      witch-sleep.mp3
      # ... etc
```

## Step 9: Sample Text with Atmospheric Pauses

Here are some key lines formatted for maximum atmosphere:

### Night Begins
```
Night falls... over the village of Miller's Hollow.

Everyone... close your eyes... and go to sleep.
```

### Werewolves Wake
```
WEREWOLVES... wake up.

Open your eyes... and recognise each other.

Together... choose a victim... by pointing at them.

Little Girl... you may peek... but beware...

If they catch you... you may not survive the night.
```

### Seer Wake
```
Seer... wake up.

You may look at one player's card... to learn their true identity.

Point at the player... you wish to investigate.
```

### Dawn Breaks
```
The night ends... and dawn breaks... over the village.

Everyone... may open their eyes.
```

## Step 10: Post-Processing (Optional)

If you want to add extra atmosphere:

**Use Audacity (free) to:**
- Add slight reverb (10-15% wet)
- Lower pitch very slightly (95-98%)
- Normalize volume levels
- Add subtle background ambience (wind, distant wolves)

**Settings:**
- Reverb: Room Size 50%, Damping 50%, Wet Level 15%
- Pitch: -2 to -3 semitones
- Compressor: Threshold -20dB, Ratio 3:1

## Estimated Costs

**Free Tier:** 10,000 chars/month
- Average script: ~100-150 chars per file
- Can record ~65-100 files free

**If you need more:**
- Starter: $5/month (30,000 chars)
- Creator: $22/month (100,000 chars)

**One-time recording:** You can record all files in one month on free tier, then cancel.

## Quality Check

Before recording all 65 files, do a test:

1. Record these 3 files:
   - `night-begins.mp3`
   - `werewolves-wake.mp3`
   - `dawn-breaks.mp3`

2. Test in the app to ensure:
   - Volume is good
   - Pace is right
   - Tone matches atmosphere
   - No awkward pauses or rushes

3. Adjust voice settings if needed

4. Then record the rest

## Quick Reference: Text Length Estimates

- **Short phrases** (sleep/wake): ~50-100 chars
- **Role instructions**: ~150-300 chars
- **Long narratives**: ~300-500 chars
- **Total script**: ~8,000-10,000 chars

---

## Ready to Start?

1. ✅ Sign up for ElevenLabs
2. ✅ Choose voice (recommend **Adam**)
3. ✅ Set voice prompt and settings
4. ✅ Record test files (night-begins, werewolves-wake, dawn-breaks)
5. ✅ Test in app
6. ✅ Record remaining files
7. ✅ Save to `/public/audio/narration/`

**Let me know when you have the first few test files ready and I'll help integrate them!**
