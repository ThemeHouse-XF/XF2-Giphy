<?php

namespace ThemeHouse\Giphy;

use XF\AddOn\AbstractSetup;
use XF\AddOn\StepRunnerInstallTrait;
use XF\AddOn\StepRunnerUninstallTrait;
use XF\AddOn\StepRunnerUpgradeTrait;
use XF\Entity\EditorDropdown;

/**
 * Class Setup
 * @package ThemeHouse\Giphy
 */
class Setup extends AbstractSetup
{
    use StepRunnerInstallTrait;
    use StepRunnerUpgradeTrait;
    use StepRunnerUninstallTrait;

    /**
     * @param array $stateChanges
     * @throws \XF\PrintableException
     * @throws \XF\PrintableException
     */
    public function postInstall(array &$stateChanges)
    {
        $this->addButtonToEditor();
    }

    /**
     * @param int $previousVersion
     * @throws \XF\PrintableException
     */
    protected function addButtonToEditor($previousVersion = 0)
    {
        if (\XF::$versionId < 2010000) {
            return;
        }

        if ($previousVersion < 1000211) {
            /** @var EditorDropdown $editorDropdown */
            $editorDropdown = $this->app()->em()->find('XF:EditorDropdown', 'xfInsert');
            if ($editorDropdown) {
                $buttons = $editorDropdown->buttons;
                if (!in_array('thGiphy', $buttons)) {
                    $buttons[] = 'thGiphy';
                }

                $editorDropdown->buttons = $buttons;
                $editorDropdown->save();
            }
        }
    }

    /**
     * @param $previousVersion
     * @param array $stateChanges
     * @throws \XF\PrintableException
     */
    public function postUpgrade($previousVersion, array &$stateChanges)
    {
        $this->addButtonToEditor($previousVersion);
    }
}