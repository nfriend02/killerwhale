using System;
using UnityEngine;
using KillerWhale.Core;
using KillerWhale.Managers;

namespace KillerWhale.Entities.Boss
{
    /// <summary>
    /// 스테이지별 보스 공통 FSM 및 라이프사이클 관리자 (기획서 4.3절)
    /// </summary>
    public abstract class BossBase : MonoBehaviour
    {
        [Header("Boss Identity")]
        [SerializeField] protected string bossNameKo = "Boss";
        [SerializeField] protected int maxHp = 100;
        [SerializeField] protected int currentHp = 100;

        [Header("FSM State")]
        [SerializeField] protected BossState currentState = BossState.Idle;
        protected float stateTimer = 0f;

        [Header("Visual Components")]
        [SerializeField] protected SpriteRenderer bossRenderer;

        public event Action<int, int> OnHpChanged; // (currentHp, maxHp)
        public event Action OnBossDefeated;

        public BossState CurrentState => currentState;
        public int CurrentHp => currentHp;
        public int MaxHp => maxHp;

        protected virtual void Awake()
        {
            if (bossRenderer == null) bossRenderer = GetComponentInChildren<SpriteRenderer>();
        }

        public virtual void SpawnBoss(int hp)
        {
            maxHp = hp;
            currentHp = hp;
            currentState = BossState.Idle;
            stateTimer = 0f;
            gameObject.SetActive(true);

            OnHpChanged?.Invoke(currentHp, maxHp);
        }

        protected virtual void Update()
        {
            if (GameManager.Instance == null || GameManager.Instance.CurrentState != GameState.Playing) return;
            if (currentState == BossState.Defeated) return;

            stateTimer += Time.deltaTime;
            UpdateFSM(Time.deltaTime);
        }

        protected abstract void UpdateFSM(float dt);

        public virtual void TakeDamage(int damage)
        {
            if (currentState == BossState.Defeated) return;

            currentHp -= damage;
            AudioManager.Instance?.PlaySfx(AudioClipType.HitThud);
            OnHpChanged?.Invoke(currentHp, maxHp);

            // 피격 플래시
            if (bossRenderer != null)
            {
                bossRenderer.color = Color.red;
                Invoke(nameof(ResetRendererColor), 0.1f);
            }

            if (currentHp <= 0)
            {
                currentHp = 0;
                Defeat();
            }
        }

        protected virtual void ResetRendererColor()
        {
            if (bossRenderer != null) bossRenderer.color = Color.white;
        }

        protected virtual void Defeat()
        {
            currentState = BossState.Defeated;
            AudioManager.Instance?.PlaySfx(AudioClipType.StageClearBgm);
            OnBossDefeated?.Invoke();

            // 1.5초 후 스테이지 클리어
            Invoke(nameof(NotifyStageClear), 1.5f);
        }

        private void NotifyStageClear()
        {
            GameManager.Instance?.ChangeState(GameState.StageClear);
            gameObject.SetActive(false);
        }
    }
}
