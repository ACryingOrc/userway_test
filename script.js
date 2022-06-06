let headings  = null
let links     = null
let landmarks = null
let direction = true

let focused = {
  heading: null,
  link: null,
  landmark: null
}

let landmark_atts = [
  "*[role=banner]",
  "*[role=complementary]",
  "*[role=contentinfo]",
  "*[role=article]",
  "*[role=form]",
  "*[role=main]",
  "*[role=navigation]",
  "*[role=region]",
  "*[role=search]",
  "*[role=landmark]",
]

let restricted_types = [
  "text",
  "email",
  "password",
  "search",
  "tel",
  "url",
]

let observer = new MutationObserver(findElements)
    observer
      .observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false
      })

function findElements() {
  headings  = document.body.querySelectorAll("h1, h2, h3, h4, h5, h6")
  links     = document.body.querySelectorAll("a[href]")
  landmarks = document.body.querySelectorAll(landmark_atts.join(","))
}

findElements()

function onKeyDown(event) {
  const KEY                 = event.which
  const IS_HEADING_KEY      = KEY === 72
  const IS_LINK_KEY         = KEY === 76
  const IS_LANDMARK_KEY     = KEY === 77
  const IS_UP_KEY = KEY     === 38
  const IS_DOWN_KEY = KEY   === 40
  const ACTIVE_ELEMENT      = document.activeElement

  if (
    ACTIVE_ELEMENT.tagName === "TEXTAREA" ||
    ACTIVE_ELEMENT.tagName === "INPUT" &&
    restricted_types.includes(ACTIVE_ELEMENT.type)
  ) return

  if (IS_UP_KEY) {
    direction = false
    return
  }

  if (IS_DOWN_KEY) {
    direction = true
    return
  }

  const ELEMENTS = IS_HEADING_KEY ? headings :
                   IS_LINK_KEY ? links :
                   IS_LANDMARK_KEY ? landmarks : null

  let element_key = IS_HEADING_KEY ? "heading" :
                    IS_LINK_KEY ? "link" :
                    IS_LANDMARK_KEY ? "landmark" : null

  if (!ELEMENTS || !element_key) return

  const LENGTH          = ELEMENTS.length
  const IS_INDEX        = focused[element_key] !== null
  const IS_FIRST_INDEX  = focused[element_key] === 0
  const IS_LAST_INDEX   = LENGTH === focused[element_key] + 1

  if (!LENGTH) return
  let el = direction ? ((!IS_INDEX || IS_LAST_INDEX) ? ELEMENTS[0] : ELEMENTS[focused[element_key] + 1]) :
                        (!IS_INDEX || IS_FIRST_INDEX) ? ELEMENTS[LENGTH - 1] : ELEMENTS[focused[element_key] - 1]

  console.log("FOCUSED ELEMENT: ", el)

  const IS_FOCUSABLE  = el.tabIndex && el.tabIndex >= 0
  if (!IS_FOCUSABLE) el.tabIndex = 0

  if (direction) {
    if (!IS_INDEX || IS_LAST_INDEX) {
      focused[element_key] = 0
    } else {
      focused[element_key]++
    }

    el.focus()
    return
  }

  else {
    if (!IS_INDEX || IS_FIRST_INDEX) {
      focused[element_key] = LENGTH - 1
    } else {
      focused[element_key]--
    }

    el.focus()
  }
}

let style = document.createElement("style")
    style.innerText = "*:focus{ background: yellow; border: 5px solid green; }"

document.head.appendChild(style)

document.addEventListener("keydown", onKeyDown)