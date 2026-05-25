import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import {
  BackSide,
  DoubleSide,
  MeshStandardMaterial,
  Raycaster,
  TextureLoader,
  Vector3,
} from 'three'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { useEffect, useMemo, useRef, useState } from 'react'

const assetPath = (path) => `${import.meta.env.BASE_URL}${path}`

const hotspots = [
  {
    id: 'throne',
    title: '王座',
    position: [-4.0, 1.62, -4.45],
    text: '王冠仍在原处，坐在上面的人却已不是旧日的国王。',
    videoSrc: assetPath('videos/throne.mp4'),
  },
  {
    id: 'goblet',
    title: '毒酒杯',
    position: [-4.75, 0.98, -1.05],
    text: '杯壁残留着暗色痕迹，像一场被洗净的谋杀。',
    videoSrc: assetPath('videos/goblet.mp4'),
  },
  {
    id: 'curtain',
    title: '帷幕',
    position: [-2.85, 1.95, -4.55],
    text: '帘幕后没有风，却传来像呼吸一样的声音。',
    videoSrc: assetPath('videos/curtain.mp4'),
  },
  {
    id: 'ghost',
    title: '鬼魂',
    position: [-4.55, 1.82, -4.05],
    text: '我不能替你复仇，但我能把黑暗照亮。',
    videoSrc: assetPath('videos/ghost.mp4'),
  },
  {
    id: 'crown',
    title: '加冕',
    position: [-3.05, 0.94, -2.48],
    text: '烛光把沉默镀成金色，每一次低头都像是在向命运宣誓。',
    videoSrc: assetPath('videos/crown.mp4'),
  },
]

const STAGE = {
  COVER: 'cover',
  PICKUP: 'pickup',
  EXPLORE: 'explore',
  LIT: 'lit',
}

const PICKUP_HOLD_MS = 1200
const CENTER_HOLD_MS = 3000
const THUMBS_UP_HOLD_MS = 1000
const DEFAULT_EYE_HEIGHT = 1.42
const INITIAL_YAW = 0
const INITIAL_PITCH = 0.18
const MIN_PITCH = -0.08
const MAX_PITCH = 0.42
const HAND_TURN_DEADZONE = 0.085
const HAND_TILT_DEADZONE = 0.09
const HAND_TURN_MAX_SPEED = 1.25
const HAND_TILT_MAX_SPEED = 0.72
const ROOM_BOUNDS = {
  minX: -4.6,
  maxX: 4.6,
  minZ: -3.8,
  maxZ: 3.8,
}
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
]

function pointDistance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function isFistGesture(landmarks) {
  const wrist = landmarks[0]
  const palmCenter = landmarks[9]
  const palmSize = pointDistance(wrist, palmCenter)
  if (!palmSize) return false

  const foldedFingers = [
    [8, 5, 6],
    [12, 9, 10],
    [16, 13, 14],
    [20, 17, 18],
  ].filter(([tipIndex, baseIndex, jointIndex]) => {
    const tip = landmarks[tipIndex]
    const base = landmarks[baseIndex]
    const joint = landmarks[jointIndex]
    if (!tip || !base || !joint) return false

    const tipToPalm = pointDistance(tip, palmCenter)
    const baseToPalm = pointDistance(base, palmCenter)
    const tipToWrist = pointDistance(tip, wrist)
    const jointToWrist = pointDistance(joint, wrist)

    return tipToPalm < palmSize * 0.9 || tipToPalm < baseToPalm * 1.3 || tipToWrist < jointToWrist * 1.12
  }).length

  return foldedFingers >= 3
}

function isThumbsUpGesture(landmarks) {
  const wrist = landmarks[0]
  const palmCenter = landmarks[9]
  const thumbMcp = landmarks[2]
  const thumbTip = landmarks[4]
  if (!wrist || !palmCenter || !thumbMcp || !thumbTip) return false

  const palmSize = pointDistance(wrist, palmCenter)
  if (!palmSize) return false

  const thumbRaised =
    thumbTip.y < thumbMcp.y - palmSize * 0.35 &&
    thumbTip.y < palmCenter.y - palmSize * 0.25 &&
    pointDistance(thumbTip, wrist) > pointDistance(thumbMcp, wrist) * 1.18

  const foldedFingers = [
    [8, 5, 6],
    [12, 9, 10],
    [16, 13, 14],
    [20, 17, 18],
  ].filter(([tipIndex, baseIndex, jointIndex]) => {
    const tip = landmarks[tipIndex]
    const base = landmarks[baseIndex]
    const joint = landmarks[jointIndex]
    if (!tip || !base || !joint) return false

    const tipToPalm = pointDistance(tip, palmCenter)
    const baseToPalm = pointDistance(base, palmCenter)
    const tipToWrist = pointDistance(tip, wrist)
    const jointToWrist = pointDistance(joint, wrist)

    return tipToPalm < palmSize * 1.15 || tipToPalm < baseToPalm * 1.35 || tipToWrist < jointToWrist * 1.08
  }).length

  return thumbRaised && foldedFingers >= 3
}

function PanoramaSphere({ lit }) {
  const texture = useLoader(TextureLoader, assetPath('panorama.png'))

  return (
    <mesh scale={[-1, 1, 1]}>
      <sphereGeometry args={[24, 60, 40]} />
      <meshBasicMaterial
        map={texture}
        side={BackSide}
        toneMapped={false}
        opacity={lit ? 1 : 0.98}
        transparent
      />
    </mesh>
  )
}

function RoomCollisionMesh({ lit, roomMeshRef }) {
  const baseGeometry = useLoader(PLYLoader, assetPath('room.ply'))
  const geometry = useMemo(() => {
    const next = baseGeometry.clone()
    next.rotateZ(Math.PI / 2)
    next.computeBoundingBox()

    if (next.boundingBox) {
      const centerX = (next.boundingBox.min.x + next.boundingBox.max.x) / 2
      const centerZ = (next.boundingBox.min.z + next.boundingBox.max.z) / 2
      const floorY = next.boundingBox.min.y
      next.translate(-centerX, -floorY, -centerZ)
    }

    next.computeVertexNormals()
    return next
  }, [baseGeometry])

  const material = useMemo(
    () =>
      new MeshStandardMaterial({
        vertexColors: true,
        side: DoubleSide,
        roughness: 0.94,
        metalness: 0.02,
        transparent: true,
        opacity: lit ? 1 : 0.98,
      }),
    [lit]
  )

  return (
    <mesh
      ref={roomMeshRef}
      geometry={geometry}
      material={material}
      visible={false}
      userData={{ lit }}
    />
  )
}

function Hotspot({ hotspot, active, visible, onSelect, onScreenUpdate }) {
  const { camera } = useThree()
  const groupRef = useRef(null)
  const projected = useRef(new Vector3())

  useFrame(() => {
    if (!groupRef.current || !visible) return
    groupRef.current.lookAt(camera.position)
    projected.current.set(...hotspot.position).project(camera)
    onScreenUpdate(hotspot.id, {
      x: projected.current.x,
      y: projected.current.y,
      visible: projected.current.z > -1 && projected.current.z < 1,
    })
  })

  if (!visible) return null

  return (
    <group ref={groupRef} position={hotspot.position}>
      <Html center distanceFactor={7} zIndexRange={[22, 10]}>
        <button
          type="button"
          className={`scene-marker ${active ? 'active' : ''}`}
          aria-label={`播放${hotspot.title}影像`}
          onPointerDown={(event) => {
            event.stopPropagation()
            onSelect(hotspot)
          }}
        >
          <img className="scene-marker-icon" src={assetPath('frame-marker.png')} alt="" aria-hidden="true" />
        </button>
      </Html>
    </group>
  )
}

function PanoramaScene({
  stage,
  selectedHotspot,
  onSelectHotspot,
  keyState,
  handTurnVelocityRef,
  handTiltVelocityRef,
  handControlEnabledRef,
  resetViewSignal,
  cameraPoseRef,
  roomMeshRef,
  onScreenHotspotUpdate,
}) {
  const { camera } = useThree()
  const resetSeenRef = useRef(resetViewSignal)
  const moveForward = useRef(new Vector3())
  const moveRight = useRef(new Vector3())
  const nextPosition = useRef(new Vector3())
  const floorProbeOrigin = useRef(new Vector3())
  const floorRaycaster = useRef(new Raycaster())
  const floorHits = useRef([])
  const viewDirection = useRef(new Vector3())
  const lookTarget = useRef(new Vector3())
  const positionDelta = useRef(new Vector3())

  useFrame((_, delta) => {
    if (resetSeenRef.current !== resetViewSignal) {
      camera.position.set(0, DEFAULT_EYE_HEIGHT, 0)
      cameraPoseRef.current = {
        yaw: INITIAL_YAW,
        pitch: INITIAL_PITCH,
        x: 0,
        y: DEFAULT_EYE_HEIGHT,
        z: 0,
        lift: 0,
      }
      resetSeenRef.current = resetViewSignal
    }

    if (stage === STAGE.PICKUP || stage === STAGE.EXPLORE || stage === STAGE.LIT) {
      const pose = cameraPoseRef.current
      const canMove = stage === STAGE.EXPLORE || stage === STAGE.LIT
      const canRotate = stage === STAGE.LIT
      const moveSpeed = (keyState.shift ? 8.8 : 5.4) * delta
      const liftSpeed = (keyState.shift ? 4.4 : 2.3) * delta

      if (!canRotate) {
        pose.yaw = INITIAL_YAW
        pose.pitch = INITIAL_PITCH
        handTurnVelocityRef.current = 0
        handTiltVelocityRef.current = 0
      }

      if (canRotate && handControlEnabledRef.current && Math.abs(handTurnVelocityRef.current) > 0.0001) {
        pose.yaw += handTurnVelocityRef.current * delta
      }
      if (canRotate && handControlEnabledRef.current && Math.abs(handTiltVelocityRef.current) > 0.0001) {
        pose.pitch += handTiltVelocityRef.current * delta
        pose.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, pose.pitch))
      }

      viewDirection.current.set(
        Math.sin(pose.yaw) * Math.cos(pose.pitch),
        Math.sin(pose.pitch),
        -Math.cos(pose.yaw) * Math.cos(pose.pitch)
      ).normalize()
      moveForward.current.set(viewDirection.current.x, 0, viewDirection.current.z).normalize()
      moveRight.current.set(viewDirection.current.z, 0, -viewDirection.current.x).normalize()
      nextPosition.current.copy(camera.position)

      if (canMove && keyState.forward) {
        nextPosition.current.addScaledVector(moveForward.current, moveSpeed)
      }
      if (canMove && keyState.back) {
        nextPosition.current.addScaledVector(moveForward.current, -moveSpeed)
      }
      if (canMove && keyState.left) {
        nextPosition.current.addScaledVector(moveRight.current, -moveSpeed)
      }
      if (canMove && keyState.right) {
        nextPosition.current.addScaledVector(moveRight.current, moveSpeed)
      }
      if (canMove && keyState.ascend) {
        pose.lift = Math.min(2.2, pose.lift + liftSpeed)
      }
      if (canMove && keyState.descend) {
        pose.lift = Math.max(-0.8, pose.lift - liftSpeed)
      }

      nextPosition.current.x = Math.max(ROOM_BOUNDS.minX, Math.min(ROOM_BOUNDS.maxX, nextPosition.current.x))
      nextPosition.current.z = Math.max(ROOM_BOUNDS.minZ, Math.min(ROOM_BOUNDS.maxZ, nextPosition.current.z))

      const roomMesh = roomMeshRef.current
      if (roomMesh) {
        floorProbeOrigin.current.set(nextPosition.current.x, 6, nextPosition.current.z)
        floorRaycaster.current.set(floorProbeOrigin.current, new Vector3(0, -1, 0))
        floorRaycaster.current.far = 12
        floorHits.current = floorRaycaster.current.intersectObject(roomMesh, false)

        const floorHit = floorHits.current.find((hit) => (hit.face?.normal.y ?? 0) > 0.35)
        pose.y = floorHit
          ? floorHit.point.y + DEFAULT_EYE_HEIGHT + pose.lift
          : DEFAULT_EYE_HEIGHT + pose.lift
      } else {
        pose.y = DEFAULT_EYE_HEIGHT + pose.lift
      }

      positionDelta.current.copy(nextPosition.current).sub(camera.position)
      camera.position.copy(nextPosition.current)
      pose.x = camera.position.x
      pose.y = camera.position.y
      pose.z = camera.position.z
      lookTarget.current.copy(camera.position).add(viewDirection.current)
      camera.lookAt(lookTarget.current)
    }
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={stage === STAGE.LIT ? 0.95 : 0.4} />
      <PanoramaSphere lit={stage === STAGE.LIT} />
      <RoomCollisionMesh lit={stage === STAGE.LIT} roomMeshRef={roomMeshRef} />
      {hotspots.map((hotspot) => (
        <Hotspot
          key={hotspot.id}
          hotspot={hotspot}
          active={selectedHotspot?.id === hotspot.id}
          visible={stage === STAGE.LIT}
          onSelect={onSelectHotspot}
          onScreenUpdate={onScreenHotspotUpdate}
        />
      ))}
    </>
  )
}

export default function App() {
  const [stage, setStage] = useState(STAGE.COVER)
  const [selectedHotspot, setSelectedHotspot] = useState(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  const [handTracked, setHandTracked] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [errorText, setErrorText] = useState('')
  const [pickupProgress, setPickupProgress] = useState(0)
  const [centerProgress, setCenterProgress] = useState(0)
  const [reveal, setReveal] = useState(0.08)
  const [resetViewSignal, setResetViewSignal] = useState(0)
  const [lanternPulse, setLanternPulse] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)
  const [gestureTurnLabel, setGestureTurnLabel] = useState(null)
  const [handDebug, setHandDebug] = useState({
    centerX: null,
    targetYaw: null,
    currentYaw: 0,
  })
  const [keyState, setKeyState] = useState({
    forward: false,
    back: false,
    left: false,
    right: false,
    ascend: false,
    descend: false,
    shift: false,
  })
  const pickupStartedAtRef = useRef(null)
  const centerStartedAtRef = useRef(null)
  const handsRef = useRef(null)
  const videoRef = useRef(null)
  const handFreshUntilRef = useRef(0)
  const dragRef = useRef({ active: false, x: 0, y: 0 })
  const pointerRef = useRef(pointer)
  const screenHotspotsRef = useRef({})
  const hotspotHoldRef = useRef({ id: null, startedAt: 0 })
  const selectedHotspotRef = useRef(null)
  const thumbsUpRef = useRef(false)
  const thumbsUpConsumedRef = useRef(false)
  const randomHotspotRef = useRef(null)
  const cameraPoseRef = useRef({ yaw: 0, pitch: 0, x: 0, y: DEFAULT_EYE_HEIGHT, z: 0, lift: 0 })
  const roomMeshRef = useRef(null)
  const handTurnVelocityRef = useRef(0)
  const handTiltVelocityRef = useRef(0)
  const handControlEnabledRef = useRef(true)
  const previewCanvasRef = useRef(null)
  const stageRef = useRef(stage)

  const progressRing = useMemo(() => 2 * Math.PI * 52, [])

  useEffect(() => {
    stageRef.current = stage
  }, [stage])

  useEffect(() => {
    pointerRef.current = pointer
  }, [pointer])

  useEffect(() => {
    selectedHotspotRef.current = selectedHotspot
  }, [selectedHotspot])

  function openVideo(hotspot) {
    selectedHotspotRef.current = hotspot
    setSelectedHotspot(hotspot)
    setActiveVideo(hotspot)
    handTurnVelocityRef.current = 0
    handTiltVelocityRef.current = 0
    hotspotHoldRef.current = { id: null, startedAt: 0 }
    randomHotspotRef.current = null
  }

  function closeVideo() {
    setActiveVideo(null)
    hotspotHoldRef.current = { id: null, startedAt: 0 }
    randomHotspotRef.current = null
  }

  function updateScreenHotspot(id, next) {
    screenHotspotsRef.current[id] = next
  }

  function drawHandPreview(landmarks = null) {
    const canvas = previewCanvasRef.current
    const video = videoRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    ctx.clearRect(0, 0, width, height)

    if (video && video.readyState >= 2) {
      ctx.save()
      ctx.scale(-1, 1)
      ctx.drawImage(video, -width, 0, width, height)
      ctx.restore()
      ctx.fillStyle = 'rgba(248, 244, 238, 0.58)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = 'rgba(16, 12, 10, 0.18)'
      for (let x = -height; x < width + height; x += 10) {
        ctx.fillRect(x, 0, 3, height)
      }
      ctx.fillStyle = 'rgba(12, 10, 8, 0.08)'
      ctx.fillRect(0, 0, width, height)
    } else {
      ctx.fillStyle = '#0d0a08'
      ctx.fillRect(0, 0, width, height)
    }

    if (!landmarks?.length) return

    ctx.lineWidth = 2
    ctx.strokeStyle = 'rgba(232, 190, 114, 0.92)'
    ctx.fillStyle = 'rgba(250, 233, 190, 0.98)'

    HAND_CONNECTIONS.forEach(([from, to]) => {
      const a = landmarks[from]
      const b = landmarks[to]
      if (!a || !b) return
      ctx.beginPath()
      ctx.moveTo((1 - a.x) * width, a.y * height)
      ctx.lineTo((1 - b.x) * width, b.y * height)
      ctx.stroke()
    })

    landmarks.forEach((point, index) => {
      const x = (1 - point.x) * width
      const y = point.y * height
      const radius = index === 9 ? 4.6 : 3.2
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  useEffect(() => {
    if (stage !== STAGE.PICKUP && stage !== STAGE.EXPLORE) {
      pickupStartedAtRef.current = null
      centerStartedAtRef.current = null
    }
  }, [stage])

  useEffect(() => {
    function handlePointerMove(event) {
      if (!handTracked) {
        const x = (event.clientX / window.innerWidth) * 2 - 1
        const y = -((event.clientY / window.innerHeight) * 2 - 1)
        setPointer({ x, y })
      }

      if (dragRef.current.active && stage === STAGE.LIT) {
        handControlEnabledRef.current = false
        const deltaX = event.clientX - dragRef.current.x
        const deltaY = event.clientY - dragRef.current.y
        dragRef.current.x = event.clientX
        dragRef.current.y = event.clientY

        cameraPoseRef.current.yaw += deltaX * 0.0026
        cameraPoseRef.current.pitch -= deltaY * 0.002
        cameraPoseRef.current.pitch = Math.max(MIN_PITCH, Math.min(MAX_PITCH, cameraPoseRef.current.pitch))
      }
    }

    function handlePointerUp() {
      dragRef.current.active = false
      handControlEnabledRef.current = true
      document.body.style.cursor = ''
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [handTracked, stage])

  useEffect(() => {
    function handleKeyDown(event) {
      const key = event.key.toLowerCase()
      if (key === 'escape' && activeVideo) {
        closeVideo()
        return
      }
      if (key === 'w') setKeyState((s) => ({ ...s, forward: true }))
      if (key === 's') setKeyState((s) => ({ ...s, back: true }))
      if (key === 'a') setKeyState((s) => ({ ...s, left: true }))
      if (key === 'd') setKeyState((s) => ({ ...s, right: true }))
      if (key === 'q') setKeyState((s) => ({ ...s, ascend: true }))
      if (key === 'e') setKeyState((s) => ({ ...s, descend: true }))
      if (key === 'shift') setKeyState((s) => ({ ...s, shift: true }))

      if (key === 'o' && (stage === STAGE.EXPLORE || stage === STAGE.LIT)) {
        setResetViewSignal((v) => v + 1)
      }

      if (key === ' ' && (stage === STAGE.EXPLORE || stage === STAGE.LIT)) {
        event.preventDefault()
        setLanternPulse(true)
        window.setTimeout(() => setLanternPulse(false), 220)
      }
    }

    function handleKeyUp(event) {
      const key = event.key.toLowerCase()
      if (key === 'w') setKeyState((s) => ({ ...s, forward: false }))
      if (key === 's') setKeyState((s) => ({ ...s, back: false }))
      if (key === 'a') setKeyState((s) => ({ ...s, left: false }))
      if (key === 'd') setKeyState((s) => ({ ...s, right: false }))
      if (key === 'q') setKeyState((s) => ({ ...s, ascend: false }))
      if (key === 'e') setKeyState((s) => ({ ...s, descend: false }))
      if (key === 'shift') setKeyState((s) => ({ ...s, shift: false }))
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [stage, activeVideo])

  useEffect(() => {
    if (stage !== STAGE.LIT || activeVideo) {
      hotspotHoldRef.current = { id: null, startedAt: 0 }
      randomHotspotRef.current = null
      return
    }

    let rafId = 0
    function tick(now) {
      const pointerNow = pointerRef.current
      const nearest = hotspots.reduce((best, hotspot) => {
        const marker = screenHotspotsRef.current[hotspot.id]
        if (!marker?.visible) return best
        const distance = Math.hypot(pointerNow.x - marker.x, pointerNow.y - marker.y)
        return !best || distance < best.distance ? { hotspot, distance } : best
      }, null)

      if (thumbsUpRef.current) {
        if (!thumbsUpConsumedRef.current) {
          if (!randomHotspotRef.current) {
            const randomHotspot = hotspots[Math.floor(Math.random() * hotspots.length)]
            randomHotspotRef.current = randomHotspot
            selectedHotspotRef.current = randomHotspot
            setSelectedHotspot(randomHotspot)
            hotspotHoldRef.current = { id: randomHotspot.id, startedAt: now }
          } else if (now - hotspotHoldRef.current.startedAt >= THUMBS_UP_HOLD_MS) {
            thumbsUpConsumedRef.current = true
            openVideo(randomHotspotRef.current)
            return
          }
        }
      } else if (nearest && nearest.distance < 0.18) {
        if (selectedHotspotRef.current?.id !== nearest.hotspot.id) {
          selectedHotspotRef.current = nearest.hotspot
          setSelectedHotspot(nearest.hotspot)
        }

        hotspotHoldRef.current = { id: null, startedAt: 0 }
        randomHotspotRef.current = null
      } else {
        hotspotHoldRef.current = { id: null, startedAt: 0 }
        randomHotspotRef.current = null
        if (selectedHotspotRef.current) {
          selectedHotspotRef.current = null
          setSelectedHotspot(null)
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [stage, activeVideo])

  useEffect(() => {
    if (stage === STAGE.COVER || stage === STAGE.PICKUP) {
      cameraPoseRef.current = {
        yaw: INITIAL_YAW,
        pitch: INITIAL_PITCH,
        x: 0,
        y: DEFAULT_EYE_HEIGHT,
        z: 0,
        lift: 0,
      }
      dragRef.current.active = false
      handTurnVelocityRef.current = 0
      handTiltVelocityRef.current = 0
      handControlEnabledRef.current = true
      setHandDebug({ centerX: null, targetYaw: null, currentYaw: 0 })
    }
  }, [stage])

  useEffect(() => {
    drawHandPreview(null)
  }, [])

  useEffect(() => {
    if (!handTracked) return

    function tick() {
      if (performance.now() > handFreshUntilRef.current) {
        setHandTracked(false)
        setGestureTurnLabel(null)
        thumbsUpRef.current = false
        thumbsUpConsumedRef.current = false
        handTurnVelocityRef.current = 0
        drawHandPreview(null)
      } else {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [handTracked])

  useEffect(() => {
    if (stage !== STAGE.PICKUP) return

    let rafId = 0
    const pickupZone = { x: 0, y: 0.03, radius: 0.3 }

    function tick(now) {
      const distance = Math.hypot(pointer.x - pickupZone.x, pointer.y - pickupZone.y)
      const inside = distance < pickupZone.radius

      if (inside) {
        if (!pickupStartedAtRef.current) pickupStartedAtRef.current = now
        const ratio = Math.min(1, (now - pickupStartedAtRef.current) / PICKUP_HOLD_MS)
        setPickupProgress(ratio)

        if (ratio >= 1) {
          setStage(STAGE.EXPLORE)
          setReveal(0.2)
          setPickupProgress(1)
          return
        }
      } else {
        pickupStartedAtRef.current = null
        setPickupProgress(0)
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [pointer, stage])

  useEffect(() => {
    if (stage !== STAGE.EXPLORE) return

    let rafId = 0
    function tick(now) {
      const distance = Math.hypot(pointer.x, pointer.y)
      const centered = distance < 0.18

      if (centered) {
        if (!centerStartedAtRef.current) centerStartedAtRef.current = now
        const ratio = Math.min(1, (now - centerStartedAtRef.current) / CENTER_HOLD_MS)
        setCenterProgress(ratio)
        setReveal(0.12 + ratio * 0.88)

        if (ratio >= 1) {
          setStage(STAGE.LIT)
          setReveal(1)
          return
        }
      } else {
        centerStartedAtRef.current = null
        setCenterProgress(0)
        setReveal((current) => Math.max(0.2, current * 0.985))
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [pointer, stage])

  const centerStrokeOffset = progressRing * (1 - centerProgress)
  const centerDistance = Math.hypot(pointer.x, pointer.y)
  const centerProgressVisible = stage === STAGE.EXPLORE && centerDistance < 0.34

  async function initHandsTracking() {
    if (!window.Hands) {
      throw new Error('hands-unavailable')
    }

    if (!handsRef.current) {
      const hands = new window.Hands({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
      })

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.55,
        minTrackingConfidence: 0.5,
      })

      hands.onResults((results) => {
        if (results.multiHandLandmarks?.length) {
          const landmarks = results.multiHandLandmarks[0]
          drawHandPreview(landmarks)
          const palm = landmarks[9]
          const mirroredPalmX = 1 - palm.x
          setPointer({
            x: mirroredPalmX * 2 - 1,
            y: -((palm.y * 2) - 1),
          })
          handFreshUntilRef.current = performance.now() + 280
          setHandTracked(true)

          const handCenterX =
            ((1 - landmarks[0].x) +
              (1 - landmarks[5].x) +
              (1 - landmarks[9].x) +
              (1 - landmarks[13].x) +
              (1 - landmarks[17].x)) / 5
          const handCenterY =
            (landmarks[0].y + landmarks[5].y + landmarks[9].y + landmarks[13].y + landmarks[17].y) / 5

          if (stageRef.current === STAGE.PICKUP || stageRef.current === STAGE.EXPLORE || stageRef.current === STAGE.LIT) {
            const thumbsUp = isThumbsUpGesture(landmarks)
            const fist = isFistGesture(landmarks)
            const handOffset = handCenterX - 0.5
            const verticalOffset = 0.5 - handCenterY
            thumbsUpRef.current = thumbsUp
            if (!thumbsUp) {
              thumbsUpConsumedRef.current = false
            }
            if (thumbsUp) {
              handTurnVelocityRef.current = 0
              handTiltVelocityRef.current = 0
              setGestureTurnLabel('thumb')
            } else if (fist) {
              handTurnVelocityRef.current = 0
              handTiltVelocityRef.current = 0
              setGestureTurnLabel('pause')
            } else if (stageRef.current === STAGE.LIT && Math.abs(handOffset) > HAND_TURN_DEADZONE) {
              const normalizedOffset =
                (Math.abs(handOffset) - HAND_TURN_DEADZONE) / (0.5 - HAND_TURN_DEADZONE)
              const turnSpeed = Math.min(1, normalizedOffset) * HAND_TURN_MAX_SPEED
              handTurnVelocityRef.current = Math.sign(handOffset) * turnSpeed
              setGestureTurnLabel(handOffset > 0 ? 'right' : 'left')
            } else {
              handTurnVelocityRef.current = 0
              setGestureTurnLabel(null)
            }
            if (!thumbsUp && !fist && stageRef.current === STAGE.LIT && Math.abs(verticalOffset) > HAND_TILT_DEADZONE) {
              const normalizedOffset =
                (Math.abs(verticalOffset) - HAND_TILT_DEADZONE) / (0.5 - HAND_TILT_DEADZONE)
              const tiltSpeed = Math.min(1, normalizedOffset) * HAND_TILT_MAX_SPEED
              handTiltVelocityRef.current = Math.sign(verticalOffset) * tiltSpeed
            } else {
              handTiltVelocityRef.current = 0
            }
            setHandDebug({
              centerX: handCenterX,
              targetYaw: handTurnVelocityRef.current,
              currentYaw: cameraPoseRef.current.yaw,
            })
          }
        } else {
          drawHandPreview(null)
          thumbsUpRef.current = false
          thumbsUpConsumedRef.current = false
          handTurnVelocityRef.current = 0
          handTiltVelocityRef.current = 0
          setGestureTurnLabel(null)
          setHandDebug((current) => ({
            ...current,
            centerX: null,
            targetYaw: null,
            currentYaw: cameraPoseRef.current.yaw,
          }))
        }
      })

      if (typeof hands.initialize === 'function') {
        await hands.initialize()
      }

      handsRef.current = hands
    }

    if (!videoRef.current) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 960 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false,
      })

      const video = document.createElement('video')
      video.autoplay = true
      video.muted = true
      video.playsInline = true
      video.srcObject = stream
      await video.play()
      videoRef.current = video
      setCameraReady(true)

      let lastSent = 0
      async function loop() {
        requestAnimationFrame(loop)
        if (!handsRef.current || video.readyState < 2) return
        const now = performance.now()
        if (now - lastSent < 33) return
        lastSent = now
        try {
          await handsRef.current.send({ image: video })
        } catch (_) {}
      }
      loop()
    }
  }

  async function beginExperience() {
    setErrorText('')
    try {
      await initHandsTracking()
      setStage(STAGE.PICKUP)
    } catch (error) {
      console.error(error)
      setErrorText('摄像头或手势识别启动失败，当前可先用鼠标继续流程')
      setStage(STAGE.PICKUP)
    }
  }

  return (
    <div className={`app-shell stage-${stage}`}>
      <div
        className="viewer-shell"
        onPointerDown={(event) => {
          if (stage !== STAGE.LIT) return
          dragRef.current = { active: true, x: event.clientX, y: event.clientY }
          document.body.style.cursor = 'grabbing'
        }}
      >

        <Canvas camera={{ position: [0, 1.42, 0], fov: 75 }}>
          <PanoramaScene
            stage={stage}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={openVideo}
            keyState={keyState}
            handTurnVelocityRef={handTurnVelocityRef}
            handTiltVelocityRef={handTiltVelocityRef}
            handControlEnabledRef={handControlEnabledRef}
            resetViewSignal={resetViewSignal}
            cameraPoseRef={cameraPoseRef}
            roomMeshRef={roomMeshRef}
            onScreenHotspotUpdate={updateScreenHotspot}
          />
        </Canvas>

        {stage === STAGE.EXPLORE && (
          <div
            className="light-mask"
            style={{
              background: `radial-gradient(circle at ${((pointer.x + 1) / 2) * 100}% ${((1 - (pointer.y + 1) / 2)) * 100}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 18%, rgba(0,0,0,0.24) 28%, rgba(0,0,0,0.72) 42%, rgba(0,0,0,0.88) 62%, rgba(0,0,0,0.94) 100%)`,
            }}
          />
        )}

        {(stage === STAGE.EXPLORE || stage === STAGE.LIT) && (
          <img
            className={`follow-lantern ${stage === STAGE.LIT ? 'hidden' : ''} ${lanternPulse ? 'pulse' : ''}`}
            src={assetPath('lantern.png')}
            alt="灯具"
            style={{
              left: `${((pointer.x + 1) / 2) * 100}%`,
              top: `${((1 - (pointer.y + 1) / 2)) * 100}%`,
            }}
          />
        )}


        {stage === STAGE.PICKUP && (
          <div className="pickup-layer">
            <div className={`pickup-target ${pickupProgress > 0 ? 'active' : ''}`}>
              <div className="pickup-glow" />
              <img src={assetPath('lantern.png')} alt="灯具" />
            </div>
            <p className="pickup-copy">
              把手放到灯具上并短暂停留，可以拿起来
            </p>
            <div className="pickup-progress">
              正在拿起灯具 {Math.ceil(pickupProgress * 100)}%
            </div>
          </div>
        )}

        {centerProgressVisible && (
          <div className="center-progress">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="progress-bg" cx="60" cy="60" r="52" />
              <circle className="progress-core" cx="60" cy="60" r="36" />
              <circle
                className="progress-ring"
                cx="60"
                cy="60"
                r="52"
                style={{
                  strokeDasharray: progressRing,
                  strokeDashoffset: centerStrokeOffset,
                }}
              />
            </svg>
          </div>
        )}

        {stage === STAGE.LIT && (
          selectedHotspot && (
            <div className="hotspot-whisper">
              <div className="hotspot-whisper-text">{selectedHotspot.text}</div>
            </div>
          )
        )}

        {activeVideo && (
          <div className="video-theater" role="dialog" aria-modal="true" aria-label={`${activeVideo.title} 影像`}>
            <div className="video-frame">
              <div className="video-frame-head">
                <div>
                  <div className="video-kicker">第三章-宴会厅</div>
                  <div className="video-title">{activeVideo.title}</div>
                </div>
                <button type="button" className="video-close" onClick={closeVideo}>
                  返回场景
                </button>
              </div>
              <video
                key={activeVideo.id}
                className="video-screen"
                src={activeVideo.videoSrc}
                controls
                autoPlay
                playsInline
                onEnded={closeVideo}
              />
            </div>
          </div>
        )}

        {stage === STAGE.COVER && (
          <section className="cover-screen">
            <div className="cover-mark">
              <span>—</span>
              <span>序 章</span>
              <span>—</span>
            </div>
            <h1>埃尔西诺的千分之一</h1>
            <div className="cover-subtitle">ONE THOUSANDTH OF ELSINORE</div>
            <div className="cover-divider" />
            <p>
              长廊深处的烛火忽明忽暗，把每个人的影子都拉得过长，仿佛连人的意图也被拖出了形状。于是复仇与怀疑同时开场，爱与忠诚在暗处改写面目。
            </p>
            <button type="button" onClick={beginExperience}>
              点 燃 烛 火
            </button>
            <div className="cover-hint">点击启用摄像头 · 以掌心为光</div>
          </section>
        )}

        {stage !== STAGE.COVER && (
          <div className="hand-preview-panel">
            <div className="hand-preview-title">手势监测</div>
            <canvas
              ref={previewCanvasRef}
              className="hand-preview-canvas"
              width={260}
              height={184}
            />
            <div className="hand-preview-status">
              {handTracked
                ? gestureTurnLabel === 'left'
                  ? '左滑中'
                  : gestureTurnLabel === 'right'
                    ? '右滑中'
                    : gestureTurnLabel === 'pause'
                      ? '暂停中'
                      : gestureTurnLabel === 'thumb'
                        ? '点赞确认中'
                        : '正在识别结构'
                : cameraReady
                  ? '搜寻中'
                  : '等待启动'}
            </div>
          </div>
        )}
      </div>

      {stage !== STAGE.LIT && (
        <div className="bottom-hint">
          {stage === STAGE.COVER && '点击启用摄像头 · 以掌心为光'}
          {stage === STAGE.PICKUP && '把手放到灯具上并短暂停留，可以拿起来'}
          {stage === STAGE.EXPLORE &&
            (centerProgress > 0
              ? '把灯停在正中央 3 秒，点亮整个房间'
              : '现在可以探索一下，用灯照亮黑暗')}
        </div>
      )}

      {(errorText || stage !== STAGE.COVER) && (
        <div className="status-strip">
          {errorText || (handTracked ? '掌心已识别' : cameraReady ? '正在寻找掌心' : '等待启动摄像头')}
        </div>
      )}
    </div>
  )
}
