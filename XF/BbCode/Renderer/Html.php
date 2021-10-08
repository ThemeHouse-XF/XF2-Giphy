<?php

namespace ThemeHouse\Giphy\XF\BbCode\Renderer;

/**
 * Class Html
 * @package ThemeHouse\Giphy\XF\BbCode\Renderer
 */
class Html extends XFCP_Html
{
    /**
     *
     */
    public function addDefaultTags()
    {
        parent::addDefaultTags();

        $this->addTag('giphy', [
            'callback' => 'renderTagTHGiphy',
            'trimAfter' => 1
        ]);
    }

    /**
     * @param array $children
     * @param $option
     * @param array $tag
     * @param array $options
     * @return mixed|string
     */
    public function renderTagTHGiphy(array $children, $option, array $tag, array $options)
    {
        $giphyUrl = $children[0];
        preg_match('/http[s]?:\/\/media[0-9]+\.giphy\.com\/media\/([a-zA-Z0-9]+)\//', $giphyUrl, $matches);
        if (empty($matches[1])) {
            return '';
        }
        $mediaKey = $matches[1];

        return $this->renderTagMedia([
            $mediaKey,
        ], 'giphy', [
            '[media=giphy]',
            '[/media]',
            'children' => [
                $mediaKey,
            ],
        ], $options);

    }
}
