<?php

namespace ThemeHouse\Giphy\XF\BbCode;

/**
 * Class RuleSet
 * @package ThemeHouse\Giphy\XF\BbCode
 */
class RuleSet extends XFCP_RuleSet
{
    /**
     *
     */
    public function addDefaultTags()
    {
        parent::addDefaultTags();

        $this->addTag('giphy', [
            'hasOption' => true,
            'plain' => true,
            'stopSmilies' => true,
            'stopAutoLink' => true
        ]);
    }
}
