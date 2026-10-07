import type { LabDevice } from '@/types/devices'

export const LAB_DEVICES: LabDevice[] = [
  {
    id: 'kingst-la2016',
    name: 'Kingst LA2016',
    kind: 'logic-analyzer',
    protocol: 'web-serial',
  },
  {
    id: 'luowei-fat',
    name: 'LUOWEI FAT',
    kind: 'board-analyzer',
    protocol: 'webusb',
  },
  {
    id: 'generic-meter',
    name: 'أجهزة القياس الأخرى',
    kind: 'meter',
    protocol: 'native-bridge',
  },
  {
    id: 'thermal-camera',
    name: 'كاميرا حرارية',
    kind: 'thermal-camera',
    protocol: 'webusb',
  },
  {
    id: 'smart-multimeter',
    name: 'Smart Multimeter with Data Export',
    kind: 'smart-multimeter',
    protocol: 'web-serial',
  },
]
