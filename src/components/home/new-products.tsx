"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { productsIn } from "@/lib/cms/catalog";

import React from 'react'

export const NewProducts = () => {
  const grid = productsIn("grid");

  return (
    <section className="mt-10">
      <h2 className="mb-4 text-lg font-semibold">New Products</h2>
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-40px" }}
        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
      >
        {grid.map((p) => (
          <motion.div
            key={p._id}
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
            }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
