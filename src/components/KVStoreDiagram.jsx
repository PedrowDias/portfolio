import styles from './KVStoreDiagram.module.css'

/**
 * Static architecture diagram for the Distributed Key-Value Store project:
 * a client write request goes to the Raft leader, which replicates it to
 * followers before acknowledging, and each node runs its own LSM-tree
 * storage engine (WAL -> memtable -> SSTables) underneath.
 */
function KVStoreDiagram() {
  return (
    <svg
      viewBox="0 0 720 340"
      className={styles.diagram}
      role="img"
      aria-label="Architecture diagram: client writes go to the Raft leader, which replicates to followers before acknowledging; each node runs its own LSM-tree storage engine"
    >
      {/* Client */}
      <rect x="20" y="150" width="100" height="50" rx="6" className={styles.clientBox} />
      <text x="70" y="180" textAnchor="middle" className={styles.clientLabel}>Client</text>

      {/* Write request arrow: Client -> Leader */}
      <line x1="120" y1="165" x2="230" y2="90" className={styles.writeArrow} markerEnd="url(#arrowWrite)" />
      <text x="150" y="115" className={styles.arrowLabel}>write</text>

      {/* Ack arrow: Leader -> Client */}
      <line x1="230" y1="110" x2="120" y2="185" className={styles.ackArrow} markerEnd="url(#arrowAck)" />
      <text x="145" y="205" className={styles.arrowLabelAck}>ack</text>

      {/* Leader node */}
      <g>
        <rect x="230" y="55" width="140" height="70" rx="6" className={styles.leaderBox} />
        <text x="300" y="82" textAnchor="middle" className={styles.nodeTitle}>Leader</text>
        <text x="300" y="100" textAnchor="middle" className={styles.nodeSubtitle}>Raft term N</text>
        <text x="300" y="115" textAnchor="middle" className={styles.nodeEngine}>LSM Engine</text>
      </g>

      {/* Replication arrows: Leader -> Follower 1 and Follower 2 */}
      <line x1="300" y1="125" x2="480" y2="180" className={styles.replArrow} markerEnd="url(#arrowRepl)" />
      <line x1="300" y1="125" x2="480" y2="270" className={styles.replArrow} markerEnd="url(#arrowRepl)" />
      <text x="390" y="140" className={styles.arrowLabel}>replicate</text>
      <text x="390" y="255" className={styles.arrowLabel}>replicate</text>

      {/* Follower 1 */}
      <g>
        <rect x="480" y="155" width="140" height="70" rx="6" className={styles.followerBox} />
        <text x="550" y="182" textAnchor="middle" className={styles.nodeTitle}>Follower</text>
        <text x="550" y="200" textAnchor="middle" className={styles.nodeSubtitle}>Raft term N</text>
        <text x="550" y="215" textAnchor="middle" className={styles.nodeEngine}>LSM Engine</text>
      </g>

      {/* Follower 2 */}
      <g>
        <rect x="480" y="245" width="140" height="70" rx="6" className={styles.followerBox} />
        <text x="550" y="272" textAnchor="middle" className={styles.nodeTitle}>Follower</text>
        <text x="550" y="290" textAnchor="middle" className={styles.nodeSubtitle}>Raft term N</text>
        <text x="550" y="305" textAnchor="middle" className={styles.nodeEngine}>LSM Engine</text>
      </g>

      {/* LSM engine internals, shown once beneath the leader as a legend */}
      <g className={styles.legend}>
        <text x="20" y="255" className={styles.legendTitle}>Each node's LSM Engine:</text>
        <rect x="20" y="270" width="70" height="26" rx="4" className={styles.legendBox} />
        <text x="55" y="287" textAnchor="middle" className={styles.legendLabel}>WAL</text>
        <line x1="90" y1="283" x2="108" y2="283" className={styles.legendArrow} markerEnd="url(#arrowLegend)" />
        <rect x="110" y="270" width="90" height="26" rx="4" className={styles.legendBox} />
        <text x="155" y="287" textAnchor="middle" className={styles.legendLabel}>Memtable</text>
        <line x1="200" y1="283" x2="218" y2="283" className={styles.legendArrow} markerEnd="url(#arrowLegend)" />
        <rect x="220" y="270" width="90" height="26" rx="4" className={styles.legendBox} />
        <text x="265" y="287" textAnchor="middle" className={styles.legendLabel}>SSTables</text>
      </g>

      <defs>
        <marker id="arrowWrite" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className={styles.writeArrowHead} />
        </marker>
        <marker id="arrowAck" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className={styles.ackArrowHead} />
        </marker>
        <marker id="arrowRepl" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" className={styles.replArrowHead} />
        </marker>
        <marker id="arrowLegend" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" className={styles.legendArrowHead} />
        </marker>
      </defs>
    </svg>
  )
}

export default KVStoreDiagram
