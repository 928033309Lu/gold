
import envConfig from '@/config/env-config.js'
export function downTemplate (url, data) {
    let link = document.createElement('a')
    link.style.display = 'none'
    link.target = '_blank'
    link.href = envConfig.apiBaseUrl + url + '?args=' + data.args
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}