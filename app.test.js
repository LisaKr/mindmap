import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import {groupCategoryPlaces, locationLabel, parsePlaces, stripLocationMetadata} from "./app.js";

const markdown = await readFile(new URL("./japan.md", import.meta.url), "utf8");
const places = parsePlaces(markdown);

test("parses every destination link", () => {
  const destinations = places.flatMap((place) => place.children?.length ? place.children : place);
  assert.equal(destinations.length, 186);
  assert.ok(destinations.every((place) => place.name && place.url && place.category));
});

test("groups Mount Mitake links under one place", () => {
  const mountMitake = places.find((place) => place.name === "Mount Mitake area");
  assert.ok(mountMitake);
  assert.equal(mountMitake.children.length, 4);
  assert.deepEqual(mountMitake.children.map((place) => place.name), [
    "A charming ryokan + onsen",
    "Mt Mitake itself",
    "The cable car",
    "A sake and tasting bar",
  ]);
});

test("keeps neighborhoods and day trips as separate main groups", () => {
  const koenji = places.find((place) => place.name === "Koenji");
  const mountMitake = places.find((place) => place.name === "Mount Mitake area");
  const grouped = groupCategoryPlaces(places);

  assert.equal(koenji.categoryGroup, "Neighborhoods");
  assert.ok(koenji.relatedPlaces.some((place) => place.name === "SUB Store Tokyo"));
  assert.ok(koenji.relatedPlaces.some((place) => place.name === "Higashi Koenji UFO Club"));
  assert.ok(grouped.find((place) => place.name === "Live venues")?.children.some(
    (place) => place.name === "Higashi Koenji UFO Club",
  ));
  assert.equal(mountMitake.categoryGroup, "Day trips");
});

test("groups food and shops into collection cards", () => {
  const grouped = groupCategoryPlaces(places);
  const collections = grouped.filter(
    (place) => place.isCollection && ["Food", "Shops"].includes(place.category),
  );
  const groupedChildren = collections.flatMap((place) => place.children);
  const originalFoodAndShops = places.filter((place) => ["Food", "Shops"].includes(place.category));

  assert.ok(collections.some((place) => place.name === "Sushi & seafood"));
  assert.ok(collections.some((place) => place.name === "Fashion & beauty"));
  assert.deepEqual(collections.find((place) => place.name === "Izakayas")?.children.map((place) => place.name), [
    "Kagaya",
    "Tatemichiya",
    "Sushiebisu HANA ebisu honten",
    "Masaka",
    "Sennari",
    "Andy's Shin Hinomoto",
  ]);
  assert.ok(collections.find((place) => place.name === "Markets & casual bites")?.children.some((place) => place.name === "Tokyo Metropolitan Government cafeteria"));
  assert.ok(collections.find((place) => place.name === "Shopping streets & markets")?.children.some((place) => place.name === "Sugamo Jizodori Shopping Street Promotion Associate"));
  assert.ok(collections.find((place) => place.name === "Shopping streets & markets")?.children.some((place) => place.name === "Bonus Track"));
  assert.ok(collections.find((place) => place.name === "Electronics, games & hobby")?.children.some((place) => place.name === "Sofmap AKIBA Amusement Hall"));
  assert.equal(groupedChildren.length, originalFoodAndShops.length);
  assert.equal(new Set(groupedChildren.map((place) => place.id)).size, originalFoodAndShops.length);
});

test("groups every shopping place into sub-category cards", () => {
  const grouped = groupCategoryPlaces(places);
  const shoppingCollections = grouped.filter(
    (place) => place.isCollection && place.categoryGroup === "Shopping",
  );
  const sourcePlaces = places.filter((place) => place.categoryGroup === "Shopping");
  const groupedChildren = shoppingCollections.flatMap((place) => place.children);

  assert.ok(shoppingCollections.some((place) => place.name === "Vintage & clothing"));
  assert.ok(shoppingCollections.some((place) => place.name === "Flea & antique markets"));
  assert.equal(groupedChildren.length, sourcePlaces.length);
  assert.deepEqual(
    new Set(groupedChildren.map((place) => place.id)),
    new Set(sourcePlaces.map((place) => place.id)),
  );
});

test("groups nature and heritage into explicit collection cards", () => {
  const grouped = groupCategoryPlaces(places);
  const expectedCollections = new Map([
    ["Parks & gardens", "Parks"],
    ["Shrines & temples", "Shrines/Temples"],
  ]);

  for (const [collectionName, category] of expectedCollections) {
    const collection = grouped.find((place) => place.isCollection && place.name === collectionName);
    const sourcePlaces = places.filter((place) => place.category === category);
    assert.ok(collection, `${collectionName} collection is present`);
    assert.deepEqual(collection.children.map((place) => place.id), sourcePlaces.map((place) => place.id));
  }
});

test("groups bars and cafes into explicit collection cards", () => {
  const grouped = groupCategoryPlaces(places);
  const expectedCollections = new Map([
    ["Listening bars", "Listening bars"],
    ["Cocktail & beer bars", "Bars"],
    ["Queer bars", "Queer"],
    ["Kissaten", "Kissaten"],
    ["Coffee shops & cafés", "Coffee"],
  ]);

  for (const [collectionName, category] of expectedCollections) {
    const collection = grouped.find((place) => place.isCollection && place.name === collectionName);
    const sourcePlaces = places.filter((place) => place.category === category);
    assert.ok(collection, `${collectionName} collection is present`);
    assert.deepEqual(collection.children.map((place) => place.id), sourcePlaces.map((place) => place.id));
  }
});

test("groups culture and nightlife into explicit collection cards", () => {
  const grouped = groupCategoryPlaces(places);
  const expectedCollections = new Map([
    ["Live venues", "Venues"],
    ["Museums", "Museums"],
    ["Bookshops", "Books"],
    ["Queer bars", "Queer"],
  ]);

  for (const [collectionName, category] of expectedCollections) {
    const collection = grouped.find((place) => place.isCollection && place.name === collectionName);
    const sourcePlaces = places.filter((place) => place.category === category);
    assert.ok(collection, `${collectionName} collection is present`);
    assert.deepEqual(collection.children.map((place) => place.id), sourcePlaces.map((place) => place.id));
  }
});

test("normalizes common Tokyo spelling variants", () => {
  assert.equal(places.find((place) => place.name.includes("Kirakuya"))?.ward, "Taito City");
  assert.equal(places.find((place) => place.name.includes("Donguri"))?.neighborhood, "Ikebukuro");
  assert.equal(places.find((place) => place.name === "Bumpodo")?.neighborhood, "Jimbocho");
  assert.equal(places.find((place) => place.name === "Kichijōji")?.ward, "Musashino City");
});

test("does not repeat a neighborhood as its city", () => {
  assert.equal(locationLabel({neighborhood: "Shibuya", ward: "Shibuya City"}), "Shibuya");
  assert.equal(locationLabel({neighborhood: "Shinjuku", ward: "Shinjuku City"}), "Shinjuku");
  assert.equal(locationLabel({neighborhood: "Koenji", ward: "Suginami City"}), "Koenji · Suginami City");
});

test("uses location annotations as metadata rather than visible copy", () => {
  assert.equal(stripLocationMetadata("tasty ramen, shinjuku"), "tasty ramen");
  assert.equal(stripLocationMetadata("best udon we ever had  shinjuku"), "best udon we ever had");
  assert.equal(stripLocationMetadata("a stationery shop, jinbocho"), "a stationery shop");
  assert.equal(stripLocationMetadata("observatory, toshima city – panoramic views"), "observatory – panoramic views");
  assert.equal(stripLocationMetadata("shinjuku"), "");
  assert.equal(stripLocationMetadata("taito city asakusa"), "");
  assert.equal(places.find((place) => place.name === "Ramen Tatsunoya Shinjuku Otakibashidōri")?.note, "tasty ramen");
  assert.equal(places.find((place) => place.name === "Your Name Stairs")?.note, "");
});