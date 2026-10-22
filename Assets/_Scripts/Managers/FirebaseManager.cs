using System;
using System.Collections.Generic;
using UnityEngine;

namespace KillerWhale.Managers
{
    [Serializable]
    public class LeaderboardEntry
    {
        public string playerName;
        public int score;
        public string character;
        public string stage;
        public long timestamp;
    }

    /// <summary>
    /// Firebase Firestore / Realtime DB 랭킹 연동 및 오프라인 로컬 캐시 관리자 (기획서 0~19절)
    /// </summary>
    public class FirebaseManager : MonoBehaviour
    {
        public static FirebaseManager Instance { get; private set; }

        [SerializeField] private bool isOnlineEnabled = false;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public void SubmitScore(string stageKey, int score, string characterName, Action<bool> callback = null)
        {
            Debug.Log($"[FirebaseManager] Submitting score {score} for {characterName} on {stageKey}");

            // 로컬 최고 점수 우선 기록
            Core.SaveSystem.Data.SetBestScore(stageKey, score);
            Core.SaveSystem.Save();

            if (!isOnlineEnabled)
            {
                callback?.Invoke(true);
                return;
            }

            // REST API 또는 Firebase SDK 요청 구현부
            callback?.Invoke(true);
        }

        public void FetchTopRankings(string stageKey, Action<List<LeaderboardEntry>> callback)
        {
            // 더미 랭킹 데이터 반환 (오프라인 모드)
            var dummyList = new List<LeaderboardEntry>
            {
                new LeaderboardEntry { playerName = "OrcaMaster", score = 145000, character = "KillerWhale", stage = stageKey },
                new LeaderboardEntry { playerName = "DeepHunter", score = 128400, character = "Shark", stage = stageKey },
                new LeaderboardEntry { playerName = "AbyssKing", score = 98700, character = "Megalodon", stage = stageKey }
            };

            callback?.Invoke(dummyList);
        }
    }
}
