import { NavItemParams } from 'app/modules/common/consts';

export function getTabs(
  tabs: NavItemParams[],
  step2Enabled: boolean,
  step3Enabled: boolean,
  step4Enabled: boolean,
  step5Enabled: boolean
) {
  return tabs.map((tab: NavItemParams, index: number) => {
    let value = false;
    if (index === 0) {
      value = true;
    }
    if (index === 1) {
      value = step2Enabled;
    }
    if (index === 2) {
      value = step3Enabled;
    }
    if (index === 3) {
      value = step4Enabled;
    }
    if (index === 5) {
      value = step5Enabled;
    }
    return { ...tab, disabled: !value };
  });
}
