const useFiles = () => {
  /**
   * Download a file that is encoded to base 64.
   * @param {string} name The name we will use to save the file
   * @param {string} base64 The file encoded in base64
   */
  const downloadFileFromBase64 = (name, base64) => {
    let a = document.createElement('a')
    a.href = base64
    a.download = name
    a.click()
  }
  return {
    downloadFileFromBase64
  }
}

export default useFiles
