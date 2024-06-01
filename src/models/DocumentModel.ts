export interface DocumentModel {
  id: string;
  name: string;
  url: string;
  lastModified: string;
}

export class DocumentModel {
  constructor(id: string, name: string, url: string, lastModified: string) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.lastModified = lastModified;
  }

  static fromStorage(data: { [key: string]: any }): DocumentModel {
    return new DocumentModel(
      data["id"] as string,
      data["name"] as string,
      data["url"] as string,
      data["last_modified"] as string
    );
  }

  toPlainObject(): { [key: string]: any } {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      lastModified: this.lastModified,
    };
  }

  static fromPlainObject(obj: { [key: string]: any }): DocumentModel {
    return new DocumentModel(obj["id"], obj["name"], obj["url"], obj["lastModified"]);
  }
}
