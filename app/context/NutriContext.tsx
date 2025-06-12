import React, { createContext, useContext, useState, ReactNode } from 'react';

type Nutrientes = {
  proteina: number;
  carboidrato: number;
};

type NutriContextType = {
  nutrientes: Nutrientes;
  adicionarNutrientes: (proteina: number, carboidrato: number) => void;
  removerNutrientes: (proteina: number, carboidrato: number) => void;
};

const NutriContext = createContext<NutriContextType | undefined>(undefined);

export const NutriProvider = ({ children }: { children: ReactNode }) => {
  const [nutrientes, setNutrientes] = useState<Nutrientes>({ proteina: 0, carboidrato: 0 });

  const adicionarNutrientes = (proteina: number, carboidrato: number) => {
    setNutrientes((prev) => ({
      proteina: prev.proteina + proteina,
      carboidrato: prev.carboidrato + carboidrato,
    }));
  };

  const removerNutrientes = (proteina: number, carboidrato: number) => {
    setNutrientes((prev) => ({
      proteina: Math.max(0, prev.proteina - proteina),
      carboidrato: Math.max(0, prev.carboidrato - carboidrato),
    }));
  };

  return (
    <NutriContext.Provider value={{ nutrientes, adicionarNutrientes, removerNutrientes }}>
      {children}
    </NutriContext.Provider>
  );
};

export const useNutri = (): NutriContextType => {
  const context = useContext(NutriContext);
  if (!context) {
    throw new Error('useNutri deve ser usado dentro de um NutriProvider');
  }
  return context;
};
