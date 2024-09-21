import React from "react";
import { test, expect } from "@jest/globals";
import ReactThreeTestRenderer from "@react-three/test-renderer";
import { ParticleField } from "../src/";

test("scene to render 4 points at density 0.1", async () => {
  const renderer = await ReactThreeTestRenderer.create(
    <ParticleField density={0.1} />
  );
  const points = renderer.scene.children[0];
  expect(points.type).toBe("Points");
  const numPoints =
    // @ts-ignore-next-line
    points._fiber.__r3f.objects[0].attributes.position.array.length / 3;
  expect(numPoints).toBe(4);
});

test("scene to render 42 points at density 3", async () => {
  const renderer = await ReactThreeTestRenderer.create(
    <ParticleField density={3} />
  );
  const points = renderer.scene.children[0];
  expect(points.type).toBe("Points");
  const numPoints =
    // @ts-ignore-next-line
    points._fiber.__r3f.objects[0].attributes.position.array.length / 3;
  expect(numPoints).toBe(42);
});
