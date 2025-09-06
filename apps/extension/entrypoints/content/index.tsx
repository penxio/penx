import ReactDOM from 'react-dom/client'
import { browser } from '#imports'
import App from './App.tsx'
import './style.css'

export default defineContentScript({
  matches: ['*://*/*'],
  cssInjectionMode: 'ui',

  async main(ctx) {
    // Listen for messages from background script
    browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'TOGGLE_SIDEPANEL' && message.action === 'open') {
        console.log('Content script received toggle sidepanel message')

        // Create a more direct approach without inline scripts
        const simulateUserGesture = () => {
          // Create a temporary button element
          const tempButton = document.createElement('button')
          tempButton.style.position = 'fixed'
          tempButton.style.top = '-1000px'
          tempButton.style.left = '-1000px'
          tempButton.style.width = '1px'
          tempButton.style.height = '1px'
          tempButton.style.opacity = '0'
          tempButton.style.pointerEvents = 'auto'
          tempButton.style.zIndex = '999999'
          tempButton.style.border = 'none'
          tempButton.style.background = 'transparent'
          document.body.appendChild(tempButton)

          // Add event listener for the click
          const handleClick = (event: Event) => {
            console.log('User gesture simulated via button click')
            event.preventDefault()
            event.stopPropagation()
            
            // Send message to background script
            browser.runtime.sendMessage({
              type: 'OPEN_SIDEPANEL_FROM_CONTENT',
            }).catch(error => {
              console.log('Failed to send message:', error)
            })

            // Clean up
            tempButton.removeEventListener('click', handleClick)
            if (document.body.contains(tempButton)) {
              document.body.removeChild(tempButton)
            }
          }

          tempButton.addEventListener('click', handleClick)

          // Focus and click the button
          tempButton.focus()
          
          // Use setTimeout to ensure the element is properly focused
          setTimeout(() => {
            tempButton.click()
          }, 10)
        }

        // Execute the simulation
        simulateUserGesture()
      }
    })

    const ui = await createShadowRootUi(ctx, {
      name: 'penx-extension',
      position: 'inline',
      anchor: 'body',
      append: 'first',
      onMount: (container) => {
        // Don't mount react app directly on <body>
        const wrapper = document.createElement('div')
        container.append(wrapper)

        const root = ReactDOM.createRoot(wrapper)
        root.render(<App />)
        return { root, wrapper }
      },
      onRemove: (elements) => {
        elements?.root.unmount()
        elements?.wrapper.remove()
      },
    })

    ui.mount()
  },
})
