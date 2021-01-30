import _ from "lodash";
import fs from "fs";
import path from "path";

function getAbsolutePath(filepath) {
  return path.resolve(process.cwd(), filepath);
}

function getDataFromFile(filepath) {
  const fileStringData = fs.readFileSync(getAbsolutePath(filepath), {
    encoding: "utf-8",
  });

  return JSON.parse(fileStringData);
}

function createDiffLogString(obj1, obj2) {
  const uniqKeys = Array.from(
    new Set(Object.keys(obj1).concat(Object.keys(obj2)))
  ).sort();

  const diff = uniqKeys.reduce((acc, key) => {
    if (obj1.hasOwnProperty(key) && !obj2.hasOwnProperty(key)) {
      acc.push(`- ${key}: ${obj1[key]}`);
    }

    if (!obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      acc.push(`+ ${key}: ${obj2[key]}`);
    }

    if (obj1.hasOwnProperty(key) && obj2.hasOwnProperty(key)) {
      if (obj1[key] === obj2[key]) {
        acc.push(`  ${key}: ${obj1[key]}`);
      } else {
        acc.push(`- ${key}: ${obj1[key]}`);
        acc.push(`+ ${key}: ${obj2[key]}`);
      }
    }

    return acc;
  }, []);

  return `{\n  ${diff.join("\n  ")}\n}`;
}

export default function genDiff(filepath1, filepath2) {
  if (!filepath1 || !filepath2) {
    throw new Error("One of the parameters wasn't passed");
  }

  const data1 = getDataFromFile(filepath1);
  const data2 = getDataFromFile(filepath2);

  return createDiffLogString(data1, data2);
}
