"use client";

import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar, { UtilityBar } from "./Navbar";
import Hero from "./Hero";
import Catalog from "./Catalog";
import DestinationStrip, { TrustBand } from "./DestinationStrip";
import GroupDepartures from "./GroupDepartures";
import VisaHub from "./VisaHub";
import Stories from "./Stories";
import Footer from "./Footer";
import ChatBot from "./ChatBot";
import ItineraryDrawer from "./ItineraryDrawer";
import { PACKAGES, getPkg, type Region } from "@/lib/data";
import { defaultFilters, matchesFilters, type Filters } from "@/lib/filters";

const scrollTo = (sel: string) => setTimeout(() => document.querySelector(sel)?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);

export default function AppShell() {
  const [activeId, setActiveId] = useState("swiss");
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [region, setRegion] = useState<Region | "all">("all");
  const [drawer, setDrawer] = useState<{ id: string; mode: "itinerary" | "customize" } | null>(null);

  const matchCount = PACKAGES.filter((p) => matchesFilters(p, filters)).length;
  const closeDrawer = useCallback(() => setDrawer(null), []);
  const open = useCallback((id: string, mode: "itinerary" | "customize") => setDrawer({ id, mode }), []);
  const showOnGlobe = useCallback((id: string) => {
    setActiveId(id);
    scrollTo("#globe");
  }, []);

  return (
    <div id="top">
      <UtilityBar />
      <Navbar onRegion={(r) => setRegion(r)} onPlan={() => open(activeId, "customize")} />
      <main>
        <Hero
          activeId={activeId}
          onSelect={setActiveId}
          onInspect={(id) => open(id, "itinerary")}
          filters={filters}
          setFilters={setFilters}
          matchCount={matchCount}
          onSearch={() => {
            setRegion("all");
            scrollTo("#packages");
          }}
        />
        <TrustBand />
        <DestinationStrip activeId={activeId} onSelect={showOnGlobe} onOpen={(id) => open(id, "itinerary")} />
        <Catalog region={region} setRegion={setRegion} filters={filters} setFilters={setFilters} onOpen={open} onGlobe={showOnGlobe} />
        <GroupDepartures onOpen={open} />
        <VisaHub />
        <Stories />
      </main>
      <Footer />
      <ChatBot onOpenPkg={(id) => open(id, "customize")} onVisa={() => scrollTo("#visa")} />
      <AnimatePresence>
        {drawer && <ItineraryDrawer key={drawer.id} pkg={getPkg(drawer.id)} mode={drawer.mode} onClose={closeDrawer} />}
      </AnimatePresence>
    </div>
  );
}
