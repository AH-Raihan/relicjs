const fs = require("fs-extra");
const path = require("path");

class Storage {
  constructor(diskName) {
    this.diskName = diskName || global.config("filesystems.default");
    this.diskConfig = global.config("filesystems.disks")[this.diskName];

    if (!this.diskConfig) {
      throw new Error(`Filesystem disk [${this.diskName}] is not configured.`);
    }

    if (this.diskConfig.driver !== "local") {
      throw new Error(
        `Driver [${this.diskConfig.driver}] is not supported. Only 'local' is available.`
      );
    }
  }

  /**
   * Select a filesystem disk.
   * @param {string} diskName - The name of the disk to use.
   * @returns {Storage}
   */
  static disk(diskName) {
    return new Storage(diskName);
  }

  /**
   * Get the full path for a file on the disk.
   * @param {string} filePath - The relative path to the file.
   * @returns {string}
   */
  path(filePath) {
    return path.join(this.diskConfig.root, filePath);
  }

  /**
   * Write contents to a file.
   * @param {string} filePath - The relative path to the file.
   * @param {string|Buffer} contents - The contents to write.
   * @returns {Promise<void>}
   */
  async put(filePath, contents) {
    const fullPath = this.path(filePath);
    // fs-extra'''s outputFileSync ensures the directory exists before writing.
    return fs.outputFile(fullPath, contents);
  }

  /**
   * Get the contents of a file.
   * @param {string} filePath - The relative path to the file.
   * @returns {Promise<Buffer>}
   */
  async get(filePath) {
    const fullPath = this.path(filePath);
    return fs.readFile(fullPath);
  }

  /**
   * Check if a file exists.
   * @param {string} filePath - The relative path to the file.
   * @returns {Promise<boolean>}
   */
  async exists(filePath) {
    const fullPath = this.path(filePath);
    return fs.pathExists(fullPath);
  }

  /**
   * Delete a file.
   * @param {string} filePath - The relative path to the file.
   * @returns {Promise<void>}
   */
  async delete(filePath) {
    const fullPath = this.path(filePath);
    return fs.remove(fullPath);
  }

  /**
   * Get the URL for a file on a public disk.
   * @param {string} filePath - The relative path to the file.
   * @returns {string}
   */
  url(filePath) {
    if (this.diskConfig.visibility !== "public") {
      throw new Error(`File URL generation is only available for 'public' disks. Disk '${this.diskName}' is not
  public.`);
    }
    // Ensure consistent forward slashes for URLs
    const urlPath = filePath.split(path.sep).join("/");
    return `${this.diskConfig.url}/${urlPath}`;
  }
}

module.exports = Storage;
