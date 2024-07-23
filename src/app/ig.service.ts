import { Injectable } from '@angular/core';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root',
})
export class IgService {
  constructor() {}

  nonFollowers: string[] = [];
  valuesFollowData: string[] = [];
  valuesBackData: string[] = [];

  readZipFile(file: File): Promise<{ followers: any[]; following: any[] }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        const result = e?.target?.result as ArrayBuffer;

        if (result) {
          const zip = new JSZip();
          zip
            .loadAsync(result)
            .then((loadedZip) => {
              if (loadedZip) {
                const followersFile = loadedZip.file(
                  'connections/followers_and_following/followers_1.json'
                );
                const followingFile = loadedZip.file(
                  'connections/followers_and_following/following.json'
                );

                if (followersFile && followingFile) {
                  const followersPromise = followersFile.async('string');
                  const followingPromise = followingFile.async('string');

                  Promise.all([followersPromise, followingPromise])
                    .then(([followersContent, followingContent]) => {
                      const followersData =
                        this.parseFollowersJson(followersContent);
                      const followingData =
                        this.parseFollowingJson(followingContent);

                      resolve({
                        followers: followersData,
                        following: followingData,
                      });
                    })
                    .catch((jsonError) => {
                      reject(jsonError);
                    });
                } else {
                  reject(
                    new Error('JSON file(s) not found in the specified path')
                  );
                }
              } else {
                reject(
                  new Error('Connections folder not found in the zip file')
                );
              }
            })
            .catch((zipError) => {
              reject(zipError);
            });
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };

      fileReader.onerror = () => {
        reject(new Error('File reading error'));
      };

      fileReader.readAsArrayBuffer(file);
    });
  }

  private parseFollowersJson(jsonContent: string): any[] {
    try {
      const followersData = JSON.parse(jsonContent);
      return followersData;
    } catch (error) {
      throw new Error('Error parsing followers_1.json: ');
    }
  }

  private parseFollowingJson(jsonContent: string): any[] {
    try {
      const parsedData = JSON.parse(jsonContent);
      const followingData = parsedData.relationships_following || [];
      return followingData;
    } catch (error) {
      throw new Error('Error parsing following.json: ');
    }
  }

  public extractNonFollowingBackAndNonFollowersBack(
    followingData: any[],
    followersData: any[]
  ): boolean {
    const followingHrefs = new Set(
      followingData.map((item) => item.string_list_data[0].href)
    );
    const followersHrefs = new Set(
      followersData.map((item) => item.string_list_data[0].href)
    );

    const nonFollowingBack = followingData.filter(
      (item) => !followersHrefs.has(item.string_list_data[0].href)
    );
    const nonFollowersBack = followersData.filter(
      (item) => !followingHrefs.has(item.string_list_data[0].href)
    );
    this.followersThatNotFollowingBack = nonFollowersBack;
    this.followingThatNotFollowingBack = nonFollowingBack;
    return true;
  }

  followingThatNotFollowingBack!: any[];
  followersThatNotFollowingBack!: any[];
}
