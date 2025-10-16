export const CLASSIFICATION_VALUES_BACKEND = ['TIRE', 'PARTS', 'LUBRICANTS'] as const;
export type SupplierClassificationBackend = typeof CLASSIFICATION_VALUES_BACKEND[number];

export const CLASSIFICATION_OPTIONS = [
    { value: 'TIRE', label: 'Pneus' },
    { value: 'PARTS', label: 'Peças' },
    { value: 'LUBRICANTS', label: 'Lubrificantes' },
];

export const SHIPPING_MODES = {
  WHATSAPP: 'WHATSAPP',
  EMAIL: 'EMAIL',
} as const;

export type ShippingModeKey = keyof typeof SHIPPING_MODES;
export type ShippingModeValue = typeof SHIPPING_MODES[ShippingModeKey];