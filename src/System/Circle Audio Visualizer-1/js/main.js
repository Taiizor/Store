let innerPercent = 50
let innerRadius = 270
let barPercent = 50
let maxLength = 1080 / 2 - innerRadius
let barWidth = 75
let startHue = 0
let endHue = 180
let saturation = 50
let lightness = 50
let compensation = 50
let glow = 10
let innerMovement = 25

let showStars = true
let starColor = "#FFFFFF"
let starOpacity = 50
let starGlow = 15

let xPercent = 50
let yPercent = 50
let movementSpeed = 50
let movementRadius = 15
let roundedBars = false

let shadowX = 8
let shadowY = 8
let shadowBlur = 10
let shadowOpacity = 70

const debug = document.getElementById("debug")
const middle = document.getElementById("middle")
const canvas = document.getElementById("canvas")
const visualizer = document.getElementById("visualizer")
const starfield = document.getElementById("starfield")
// Fullscreen canvas
canvas.width = document.body.clientWidth
canvas.height = document.body.clientHeight
let axis = 0

const ctx = canvas.getContext("2d")

function SucroseAudioData(obj) {
	if (obj == null || !obj.State) return;
	var audioArray = obj.Data;
	// Set overall level
	average = audioArray.reduce((acc, val) => acc + val) / audioArray.length
	star_speed = average * 32
	// Remove duplicate frequencies
	let audio = audioArray.filter((elem, idx, arr) => arr[idx - 1] !== elem)
	// Compensate for overamplified bass
	audio = audio.map((elem, idx, arr) => {
		return elem * (idx / arr.length + (100 - compensation + 50) / 100)
	})
	// Mirror on vertical axis
	audio = audio.slice().reverse().concat(audio)

	let innerRadius = (ctx.canvas.height / 2) * (innerPercent / 100)
	let maxLength = (ctx.canvas.height / 2 - innerRadius) * (barPercent / 100)
	// Bar length, val = 100 -> reach border of screen

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
	ctx.lineWidth = ((barWidth / 100) * (2 * innerRadius * Math.PI)) / audio.length
	ctx.lineCap = roundedBars ? "round" : "butt"
	ctx.shadowBlur = glow
	// Visualizer location
	let xPos = ctx.canvas.width * (xPercent / 100)
	xPos += (noise(axis) - 0.5) * ((innerRadius * movementRadius) / 100)
	let yPos = ctx.canvas.height * (yPercent / 100)
	yPos += (noise(0, axis) - 0.5) * ((innerRadius * movementRadius) / 100)
	axis += average * (movementSpeed / 100)
	// Logo center image location
	if (middle.style.display != "none") {
		middle.style.left = `${xPos}px`
		middle.style.top = `${yPos}px`
	}

	// Visualizer drop shadow
	visualizer.style.filter = `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${
    shadowOpacity / 100
  }))`

	if (audio.length > 2) {
		// Draw each bar
		audio.map((val, index, arr) => {
			let ratio = (index + 0.5) / arr.length
			let halfRatio = Math.abs(((index / (arr.length / 2)) % (arr.length / 2)) - 1)
			ctx.beginPath()
			ctx.translate(xPos, yPos)
			// Rotate each bar
			ctx.rotate(2 * Math.PI * ratio)

			// Color from given hue, saturation, lightness
			let color = `hsl(${
        ((endHue - startHue) * halfRatio + startHue) % 360
      }, ${saturation}%, ${lightness}%)`
			ctx.strokeStyle = color
			ctx.shadowColor = color

			let innerOffset = average * maxLength * (innerMovement / 100)
			// Move to approparite height
			ctx.moveTo(0, innerRadius + innerOffset)
			// Draw line outwards from origin
			ctx.lineTo(0, val * maxLength + innerRadius + innerOffset)
			// Apply stroke
			ctx.stroke()
			// Reset current transformation matrix to the identity matrix
			ctx.setTransform(1, 0, 0, 1, 0, 0)
		})
	}
}

function SucrosePropertyListener(name, val) {
	// debug.textContent += `Name: ${name} Val: ${val}`
	switch (name) {
		case "innerRadius":
			innerPercent = val.value
			// Logo image width & height
			let rad = (ctx.canvas.height / 2) * (val.value / 100)
			middle.style.width = `${rad * 2}px`
			middle.style.height = `${rad * 2}px`
			break
		case "middleImageScale":
			middle.style.transform = `translate(-50%, -50%) scale(${val.value / 100})`
			break
		case "maxLength":
			barPercent = val.value
			break
		case "bgImage":
			document.body.style.backgroundImage = `url(./${val.folder}/${val.value.replace(/\\/g, "/")})`
			break
		case "bgBlur":
			document.body.style.backdropFilter = `blur(${Math.round(val.value)}px)`
			break
		case "useMiddleImage":
			middle.style.display = val.value ? "block" : "none"
			break
		case "middleImage":
			middle.src = `./${val.folder}/${val.value.replace(/\\/g, "/")}`
			break
		case "barWidth":
			barWidth = val.value
			break
		case "startHue":
			startHue = val.value
			break
		case "endHue":
			endHue = val.value
			break
		case "saturation":
			saturation = val.value
			break
		case "lightness":
			lightness = val.value
			break
		case "barCompensation":
			compensation = val.value
			break
		case "barGlow":
			glow = val.value
			break
		case "innerMovement":
			innerMovement = val.value
			break
		case "showStars":
			showStars = val.value
			break
		case "starColor":
			starColor = "#" + val.value.substring(3)
			break
		case "starOpacity":
			starOpacity = val.value
			break
		case "starGlow":
			starGlow = val.value
			break
		case "starBlur":
			starfield.style.filter = `blur(${val.value / 2}px)`
			break
		case "xPercent":
			xPercent = val.value
			break
		case "yPercent":
			yPercent = val.value
			break
		case "shakeSpeed":
			movementSpeed = val.value
			break
		case "shakeRadius":
			movementRadius = val.value
			break
		case "roundedBars":
			roundedBars = val.value
			break
		case "shadowX":
			shadowX = val.value
			break
		case "shadowY":
			shadowY = val.value
			break
		case "shadowBlur":
			shadowBlur = val.value
			break
		case "shadowOpacity":
			shadowOpacity = val.value
			break
		default:
			// console.error(`Unknown customization option: ${name}`)
			break
	}
}

document.addEventListener("DOMContentLoaded", (event) => {
	SucroseAudioData([0])
})