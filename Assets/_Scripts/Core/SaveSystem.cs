using System;
using System.Collections.Generic;
using UnityEngine;

namespace KillerWhale.Core
{
    [Serializable]
    public class ControlOffsetData
    {
        public float jumpX = 0f;
        public float jumpY = 0f;
        public float dpadX = 0f;
        public float dpadY = 0f;
        public float opacity = 0.8f;   // 0.2 ~ 1.0
        public float scale = 1.0f;     // 0.8 ~ 1.2
    }

    [Serializable]
    public class SaveData
    {
        public bool introSeen = false;
        public int selectedLives = 3;         // 3, 4, 5, 6
        public int unlockedStage = 1;         // 1 ~ 5
        public string selectedCharacter = "killer_whale";
        public List<string> unlockedCharacters = new List<string> { "killer_whale" };

        public ControlOffsetData controlOffset = new ControlOffsetData();

        // 직렬화를 위해 List 형태의 Key-Value 쌍 지원
        public List<string> bestScoreKeys = new List<string>();
        public List<int> bestScoreValues = new List<int>();

        public List<string> bestStarKeys = new List<string>();
        public List<int> bestStarValues = new List<int>();

        public List<string> preyCollectionKeys = new List<string>();
        public List<bool> preyCollectionValues = new List<bool>();

        // 오디오 및 햅틱
        public float bgmVolume = 0.8f;
        public float sfxVolume = 0.9f;
        public bool hapticEnabled = true;

        public int GetBestScore(string stageKey)
        {
            int index = bestScoreKeys.IndexOf(stageKey);
            return index >= 0 ? bestScoreValues[index] : 0;
        }

        public void SetBestScore(string stageKey, int score)
        {
            int index = bestScoreKeys.IndexOf(stageKey);
            if (index >= 0)
            {
                if (score > bestScoreValues[index])
                    bestScoreValues[index] = score;
            }
            else
            {
                bestScoreKeys.Add(stageKey);
                bestScoreValues.Add(score);
            }
        }

        public int GetBestStars(string stageKey)
        {
            int index = bestStarKeys.IndexOf(stageKey);
            return index >= 0 ? bestStarValues[index] : 0;
        }

        public void SetBestStars(string stageKey, int stars)
        {
            int index = bestStarKeys.IndexOf(stageKey);
            if (index >= 0)
            {
                if (stars > bestStarValues[index])
                    bestStarValues[index] = stars;
            }
            else
            {
                bestStarKeys.Add(stageKey);
                bestStarValues.Add(stars);
            }
        }

        public bool IsPreyCollected(string preyId)
        {
            int index = preyCollectionKeys.IndexOf(preyId);
            return index >= 0 && preyCollectionValues[index];
        }

        public void CollectPrey(string preyId)
        {
            int index = preyCollectionKeys.IndexOf(preyId);
            if (index >= 0)
            {
                preyCollectionValues[index] = true;
            }
            else
            {
                preyCollectionKeys.Add(preyId);
                preyCollectionValues.Add(true);
            }
        }
    }

    /// <summary>
    /// 로컬 영구 저장소 (PlayerPrefs / JSON 스키마 관리)
    /// </summary>
    public static class SaveSystem
    {
        private const string SAVE_KEY = "killerwhale.save.v1";
        private static SaveData _cachedData;

        public static SaveData Data
        {
            get
            {
                if (_cachedData == null)
                {
                    Load();
                }
                return _cachedData;
            }
        }

        public static void Load()
        {
            if (PlayerPrefs.HasKey(SAVE_KEY))
            {
                try
                {
                    string json = PlayerPrefs.GetString(SAVE_KEY);
                    _cachedData = JsonUtility.FromJson<SaveData>(json);
                }
                catch (Exception e)
                {
                    Debug.LogWarning($"[SaveSystem] Failed to parse save data. Resetting to default. Err: {e.Message}");
                    _cachedData = new SaveData();
                }
            }
            else
            {
                _cachedData = new SaveData();
            }
        }

        public static void Save()
        {
            if (_cachedData == null) _cachedData = new SaveData();
            string json = JsonUtility.ToJson(_cachedData);
            PlayerPrefs.SetString(SAVE_KEY, json);
            PlayerPrefs.Save();
        }

        public static void ResetAll()
        {
            PlayerPrefs.DeleteKey(SAVE_KEY);
            _cachedData = new SaveData();
            Save();
        }
    }
}
