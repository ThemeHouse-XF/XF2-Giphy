<?php

namespace ThemeHouse\Giphy\Listener;

use XF\Data\Editor;

/**
 * Class EditorButtonData
 * @package ThemeHouse\Giphy\Listener
 */
class EditorButtonData
{
    /**
     * @param array $buttons
     * @param Editor $editorData
     */
    public static function run(array &$buttons, Editor $editorData)
    {
        $escape = true;

        $templater = \XF::app()->templater();
        $imagePath = null;
        $fontAwesomeIcon = null;
        $giphyIconType = $templater->fnProperty($templater, $escape, 'th_giphyIconType_giphy') ?: 'image';
        $giphyIconValue = $templater->fnProperty($templater, $escape,
            'th_giphyIconValue_giphy') ?: 'styles/themehouse/giphy/giphy.png';

        switch ($giphyIconType) {
            case 'font':
                $fontAwesomeIcon = $giphyIconValue;
                break;

            case 'image':
            default:
                $imagePath = $giphyIconValue;
                break;
        }

        if (\XF::options()->th_apiKey_giphy) {
            $buttons['thGiphy'] = [
                'image' => $imagePath,
                'fa' => $fontAwesomeIcon,

                'title' => \XF::phrase('giphy'),
            ];
        }
    }
}