export function initTheme(){
  try{
    const saved = localStorage.getItem('theme')
    if(saved){
      document.documentElement.setAttribute('data-theme', saved)
      return saved
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const theme = prefersDark ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
    return theme
  }catch(e){return 'dark'}
}
export function toggleTheme(){
  const cur = document.documentElement.getAttribute('data-theme') || 'dark'
  const next = cur === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', next)
  try{ localStorage.setItem('theme', next) }catch(e){}
  return next
}
export function getTheme(){
  return document.documentElement.getAttribute('data-theme') || 'dark'
}
