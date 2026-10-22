using System.Collections.Generic;
using UnityEngine;

namespace KillerWhale.Data
{
    /// <summary>
    /// 모바일 발열/GC 방지를 위한 고성능 범용 오브젝트 풀링 클래스 (기획서 5절 준수)
    /// </summary>
    public class ObjectPool : MonoBehaviour
    {
        public static ObjectPool Instance { get; private set; }

        [System.Serializable]
        public class PoolItem
        {
            public string poolKey;
            public GameObject prefab;
            public int initialSize = 20;
            public bool allowExpand = true;
        }

        [SerializeField] private List<PoolItem> poolConfigurations = new List<PoolItem>();

        private readonly Dictionary<string, Queue<GameObject>> poolDictionary = new Dictionary<string, Queue<GameObject>>();
        private readonly Dictionary<string, GameObject> prefabLookup = new Dictionary<string, GameObject>();
        private readonly Dictionary<string, Transform> poolParents = new Dictionary<string, Transform>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            InitializePools();
        }

        private void InitializePools()
        {
            for (int i = 0; i < poolConfigurations.Count; i++)
            {
                var item = poolConfigurations[i];
                RegisterPrefab(item.poolKey, item.prefab, item.initialSize);
            }
        }

        public void RegisterPrefab(string poolKey, GameObject prefab, int initialSize = 10)
        {
            if (prefab == null || poolDictionary.ContainsKey(poolKey)) return;

            prefabLookup[poolKey] = prefab;

            GameObject parentObj = new GameObject($"[Pool] {poolKey}");
            parentObj.transform.SetParent(this.transform);
            poolParents[poolKey] = parentObj.transform;

            Queue<GameObject> objectQueue = new Queue<GameObject>(initialSize);

            for (int i = 0; i < initialSize; i++)
            {
                GameObject obj = Instantiate(prefab, parentObj.transform);
                obj.name = $"{poolKey}_{i}";
                obj.SetActive(false);
                objectQueue.Enqueue(obj);
            }

            poolDictionary.Add(poolKey, objectQueue);
        }

        public GameObject Spawn(string poolKey, Vector3 position, Quaternion rotation)
        {
            if (!poolDictionary.ContainsKey(poolKey))
            {
                Debug.LogWarning($"[ObjectPool] Pool with key '{poolKey}' doesn't exist!");
                return null;
            }

            Queue<GameObject> queue = poolDictionary[poolKey];
            GameObject objToSpawn = null;

            if (queue.Count > 0)
            {
                objToSpawn = queue.Dequeue();
            }
            else
            {
                // 필요시 풀 자동 확장
                if (prefabLookup.TryGetValue(poolKey, out GameObject prefab))
                {
                    Transform parent = poolParents.ContainsKey(poolKey) ? poolParents[poolKey] : transform;
                    objToSpawn = Instantiate(prefab, parent);
                }
                else
                {
                    return null;
                }
            }

            objToSpawn.transform.position = position;
            objToSpawn.transform.rotation = rotation;
            objToSpawn.SetActive(true);

            // IPoolable 콜백 호출
            var poolable = objToSpawn.GetComponent<IPoolable>();
            poolable?.OnSpawnFromPool();

            return objToSpawn;
        }

        public void Despawn(string poolKey, GameObject obj)
        {
            if (obj == null) return;

            var poolable = obj.GetComponent<IPoolable>();
            poolable?.OnReturnToPool();

            obj.SetActive(false);

            if (poolParents.TryGetValue(poolKey, out Transform parent))
            {
                obj.transform.SetParent(parent);
            }

            if (poolDictionary.ContainsKey(poolKey))
            {
                poolDictionary[poolKey].Enqueue(obj);
            }
            else
            {
                Destroy(obj);
            }
        }

        public void ClearPool(string poolKey)
        {
            if (!poolDictionary.ContainsKey(poolKey)) return;

            var queue = poolDictionary[poolKey];
            while (queue.Count > 0)
            {
                GameObject obj = queue.Dequeue();
                if (obj != null) Destroy(obj);
            }

            if (poolParents.TryGetValue(poolKey, out Transform parent))
            {
                Destroy(parent.gameObject);
                poolParents.Remove(poolKey);
            }

            poolDictionary.Remove(poolKey);
            prefabLookup.Remove(poolKey);
        }
    }

    public interface IPoolable
    {
        void OnSpawnFromPool();
        void OnReturnToPool();
    }
}
